from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from collections import Counter
from core.database import get_db
from core.security import get_current_user
from models.health import Symptom
from models.appointment import Appointment
from models.user import User

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    symptoms = db.query(Symptom).filter(Symptom.user_id == user.id).all()
    appointments = db.query(Appointment).filter(Appointment.user_id == user.id).all()

    # Symptom stats
    total_symptoms = len(symptoms)
    avg_severity = round(sum(s.severity for s in symptoms) / len(symptoms), 1) if symptoms else 0

    # Most common symptoms for bar chart — field name: symptom_counts
    symptom_counter = Counter(s.symptom for s in symptoms)
    symptom_counts = [{"symptom": k, "count": v} for k, v in symptom_counter.most_common(5)]

    # Severity by week for line chart — field name: severity_by_week
    week_data: dict = {}
    for s in symptoms:
        if s.week:
            if s.week not in week_data:
                week_data[s.week] = []
            week_data[s.week].append(s.severity)
    severity_by_week = [
        {"week": w, "severity": round(sum(v) / len(v), 1)}
        for w, v in sorted(week_data.items())
    ]

    # Appointment types for pie chart — field name: appointment_types
    type_counter = Counter(a.appointment_type for a in appointments)
    appointment_types = [{"type": k, "count": v} for k, v in type_counter.items()]

    # Next appointment
    now = datetime.utcnow().isoformat()
    upcoming = [a for a in appointments if not a.completed and a.appointment_date > now]
    upcoming.sort(key=lambda x: x.appointment_date)
    next_appt = None
    if upcoming:
        a = upcoming[0]
        next_appt = {
            "id": a.id,
            "doctor_name": a.doctor_name,
            "appointment_type": a.appointment_type,
            "appointment_date": a.appointment_date,
            "location": a.location,
        }

    return {
        # Pregnancy — dashboard.tsx reads data.weeks_pregnant
        "weeks_pregnant": user.weeks_pregnant or 0,
        "due_date": user.due_date,

        # Symptoms — dashboard.tsx reads data.total_symptoms, data.avg_severity
        "total_symptoms": total_symptoms,
        "avg_severity": avg_severity,

        # Charts — insights.tsx reads these field names
        "symptom_counts": symptom_counts,
        "severity_by_week": severity_by_week,
        "appointment_types": appointment_types,

        # Appointments
        "total_appointments": len(appointments),
        "next_appointment": next_appt,

        # Symptom count alias
        "symptom_count": total_symptoms,
    }


@router.get("/insights")
def insights(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    symptoms = db.query(Symptom).filter(Symptom.user_id == user.id).all()
    appointments = db.query(Appointment).filter(Appointment.user_id == user.id).all()
    results = []

    # High severity warning
    high = [s for s in symptoms if s.severity >= 4]
    if len(high) >= 2:
        top = Counter(s.symptom for s in high).most_common(1)
        results.append({
            "type": "warning",
            "emoji": "⚠️",
            "title": "Recurring High-Severity Symptom",
            "message": f"You've logged '{top[0][0]}' with high severity {top[0][1]} times. Consider discussing with your doctor.",
        })

    # Active tracking
    recent = [s for s in symptoms if (datetime.utcnow() - s.created_at).days <= 7]
    if len(recent) >= 3:
        results.append({
            "type": "success",
            "emoji": "🌸",
            "title": "Great Health Tracking!",
            "message": f"You've logged {len(recent)} symptoms this week. Staying consistent helps spot important patterns.",
        })

    # No upcoming appointments
    now = datetime.utcnow().isoformat()
    upcoming = [a for a in appointments if not a.completed and a.appointment_date > now]
    if not upcoming:
        results.append({
            "type": "reminder",
            "emoji": "📅",
            "title": "Schedule Your Next Visit",
            "message": "You have no upcoming appointments. Regular prenatal checkups are important for you and your baby.",
        })
    else:
        upcoming.sort(key=lambda x: x.appointment_date)
        next_a = upcoming[0]
        try:
            days = (datetime.fromisoformat(next_a.appointment_date) - datetime.utcnow()).days
            if days <= 3:
                results.append({
                    "type": "reminder",
                    "emoji": "🔔",
                    "title": "Appointment Coming Up!",
                    "message": f"Your appointment with {next_a.doctor_name} is in {max(0, days)} day(s). Don't forget!",
                })
        except:
            pass

    # Weeks pregnant milestone
    weeks = user.weeks_pregnant or 0
    if weeks in [12, 20, 28, 36]:
        results.append({
            "type": "success",
            "emoji": "🎉",
            "title": f"Week {weeks} Milestone!",
            "message": f"Congratulations on reaching week {weeks}! This is an important milestone in your pregnancy journey.",
        })

    if not results:
        results.append({
            "type": "info",
            "emoji": "💡",
            "title": "Keep Going!",
            "message": "Log symptoms and appointments regularly to unlock personalized insights for your journey.",
        })

    return {"insights": results}
