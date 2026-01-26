# Global Wallet V10 - Design Guidelines

## Brand Identity
**Purpose**: A premium expense tracking app with voice-AI input and referral rewards, targeting wealth-conscious users.

**Aesthetic Direction**: **Luxurious/refined** - Premium materials, executive sophistication, subtle gold accents on deep navy. Think private banking app meets modern fintech.

**Memorable Element**: Pulsing gold microphone for voice-AI expense entry - the signature interaction that sets this app apart.

---

## Navigation Architecture

**Root Navigation**: Tab Bar (4 tabs + floating action button)
- **Home** - Dashboard with expense cards
- **Referrals** - Network tree and rewards
- **Reports** - Analytics and sharing (premium feature)
- **Profile** - Settings and admin modules
- **Floating Button** - Voice/Manual expense entry (gold, pulsing glow)

**Auth Flow**: Custom mobile + PIN (stack-only, no tabs until authenticated)

---

## Screen Specifications

### 1. Onboarding/Auth Screens

**Login Screen**
- Layout: Centered card on navy gradient background
- Components: Mobile input (+91 prefix), 6-digit PIN input, "Forgot PIN?" link, "Create Account" button
- Header: None (full-screen)
- Safe area: top: insets.top + 40, bottom: insets.bottom + 40

**Signup Screen**
- Layout: Scrollable form with steps indicator
- Components: Mobile input, PIN creation (confirm twice), referral code input (optional), auto-generated 6-digit Recovery Key display (gold card, copy button)
- Submit: "Create Account" button below form
- Header: Back button left, transparent

**Forgot PIN Screen**
- Layout: Centered card
- Components: Mobile input, Recovery Key input, New PIN fields
- Submit: "Reset PIN" button below form

---

### 2. Main Tabs

**Home Screen**
- Header: Transparent, profile avatar right, admin icon left (if is_admin)
- Layout: Scrollable
- Components:
  - Total expense card (red gradient, large number, filter dropdown: Daily/Weekly/Monthly/Custom)
  - Expense list (cards with category icon, amount, edit/delete icons)
  - Empty state if no expenses
- Safe area: top: headerHeight + 20, bottom: tabBarHeight + 80 (room for floating button)

**Referrals Screen**
- Header: Default, title "My Network"
- Layout: Scrollable
- Components:
  - Referral code card (gold border, copy button)
  - 3-tier rewards breakdown (T1: Direct, T2: Passive, Bonus)
  - Network tree visualization (circles with avatars, connecting lines)
  - Share button (WhatsApp/Copy)
- Safe area: top: 20, bottom: tabBarHeight + 20

**Reports Screen** (Premium)
- Header: Default, title "Analytics", download icon right
- Layout: Scrollable
- Components:
  - For free users: Blurred charts with "₹ UPGRADE" button overlay
  - For premium: Category pie chart, spending trends line chart, export buttons (WhatsApp/PDF)
- Safe area: top: 20, bottom: tabBarHeight + 20

**Profile Screen**
- Header: Default, title "Profile"
- Layout: Scrollable list
- Components:
  - Avatar and name card
  - Premium status badge
  - Settings sections: Account, Preferences, Help
  - Admin modules (visible if is_admin): Remote Control, Download Stats, Premium Tracker, Active Referrers, P&L, Leaderboard
  - Logout button (bottom)
- Safe area: top: 20, bottom: tabBarHeight + 20

---

### 3. Modals

**Expense Entry Modal** (triggered by floating button)
- Layout: Bottom sheet (2/3 screen height)
- Components:
  - Toggle: Voice AI (pulsing gold mic) / Manual (keyboard icon)
  - Voice mode: Large mic button, waveform animation, parsed text display
  - Manual mode: Category dropdown, Amount input, Submit button
- Safe area: bottom: insets.bottom + 20

**Edit Expense Modal**
- Layout: Bottom sheet
- Components: Category, Amount, Date, Save/Cancel buttons
- Safe area: bottom: insets.bottom + 20

**Upgrade Modal** (paywall)
- Layout: Centered card
- Components: Premium benefits list, "Pay ₹X via UPI" button (simulated)
- Safe area: centered

---

## Color Palette

**Primary Colors**:
- Navy Deep: `#0A192F` (backgrounds, headers)
- Gold Luxury: `#FFD700` (accents, buttons, highlights)

**Supporting Colors**:
- Navy Light: `#1A2F4F` (cards, surfaces)
- Gold Dim: `#D4AF37` (secondary accents)
- Success Green: `#10B981` (rewards, positive)
- Alert Red: `#EF4444` (expenses, delete)

**Text Colors**:
- Primary: `#F8FAFC` (white-tinted for navy backgrounds)
- Secondary: `#94A3B8` (muted gold-gray)
- Inverse: `#0A192F` (on gold backgrounds)

---

## Typography

**Font**: Montserrat (Google Font) - bold, executive, modern
- **Display**: 32px, Bold (dashboard numbers)
- **H1**: 24px, SemiBold (screen titles)
- **H2**: 18px, SemiBold (card headers)
- **Body**: 16px, Regular (content)
- **Caption**: 14px, Regular (labels, metadata)

---

## Visual Design

**Touchables**: Gold buttons with subtle glow effect (shadowOpacity: 0.3, shadowRadius: 8, shadowColor: #FFD700)
**Cards**: Navy Light (#1A2F4F) with 1px gold border, 12px radius
**Icons**: Feather icons in gold or white
**Floating Action Button**: 64px circle, gold gradient, pulsing animation (scale 1.0 to 1.1), mic icon, shadow (offset: 0, 4, opacity: 0.4, radius: 8)

---

## Assets to Generate

1. **icon.png** - Gold "GW" monogram on navy circle - App icon
2. **splash-icon.png** - Same as icon.png - Splash screen
3. **empty-expenses.png** - Minimalist gold coin with upward arrow - Home screen empty state
4. **empty-network.png** - Stylized tree with gold nodes - Referrals empty state
5. **avatar-default.png** - Navy circle with gold initials "U" - Profile placeholder
6. **premium-badge.png** - Gold crown icon - Premium user badge
7. **voice-waveform.png** - Animated gold soundwave - Voice input active state
8. **upgrade-illustration.png** - Gold key unlocking navy vault - Paywall modal