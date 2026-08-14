# MamaCare

MamaCare is a warm pregnancy companion web app for tracking health, managing appointments, viewing insights, and chatting with a maternal care assistant.

## How to change the logo

The app logo is controlled from one reusable file:

```txt
src/components/BrandLogo.tsx
```

### Option 1: Change the icon logo

Open `src/components/BrandLogo.tsx` and replace the `Baby` icon inside `LogoMark` with another icon from `lucide-react`.

Example:

```tsx
import { Heart } from "lucide-react";
```

Then use:

```tsx
<Heart className="w-5 h-5 text-white animate-heartbeat" />
```

### Option 2: Use your own logo image

1. Put your logo file inside:

```txt
src/assets/
```

For example:

```txt
src/assets/logo.png
```

2. Open `src/components/BrandLogo.tsx` and import it:

```tsx
import logo from "@/assets/logo.png";
```

3. Replace the icon inside `LogoMark` with:

```tsx
<img src={logo} alt="MamaCare logo" className="w-6 h-6 object-contain" />
```

### Option 3: Change the brand name

In `src/components/BrandLogo.tsx`, change this text:

```tsx
MamaCare
```

to your new brand name.

The logo will update everywhere it appears, including the landing page, login page, signup page, and dashboard sidebar.