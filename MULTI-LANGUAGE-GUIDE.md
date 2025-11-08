# Multi-Language Support Guide 🌍

Your Climate Tracker app now supports **5 languages**:
- 🇬🇧 English
- 🇮🇳 हिंदी (Hindi)
- 🇮🇳 ಕನ್ನಡ (Kannada)
- 🇮🇳 தமிழ் (Tamil)
- 🇮🇳 తెలుగు (Telugu)

## How to Use Translations in Your Components

### 1. Import the useTranslation hook

```typescript
import { useTranslation } from 'react-i18next';
```

### 2. Use the t() function in your component

```typescript
const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
      <button>{t('common.save')}</button>
    </div>
  );
};
```

### 3. Available Translation Keys

Check the files in `src/locales/` for all available keys:

**Navigation** (`nav.*`)
- `nav.dashboard` - Dashboard
- `nav.carbonTracker` - Carbon Tracker
- `nav.ccusHub` - CCUS Hub
- `nav.ecoMarket` - EcoMarket
- `nav.climateMap` - Climate Map
- `nav.socialFeed` - Social Feed
- `nav.advocacy` - Advocacy
- `nav.login` - Login
- `nav.signUp` - Sign Up

**Home** (`home.*`)
- `home.title` - Climate Tracker
- `home.subtitle` - Monitor Climate Change & Carbon Footprint
- `home.description` - Full description
- `home.getStarted` - Get Started
- `home.learnMore` - Learn More

**Dashboard** (`dashboard.*`)
- `dashboard.welcome` - Welcome back!
- `dashboard.yourImpact` - Your Climate Impact
- `dashboard.carbonSaved` - Carbon Saved
- `dashboard.treesPlanted` - Trees Planted
- `dashboard.waterSaved` - Water Saved

**Social** (`social.*`)
- `social.share` - Share
- `social.like` - Like
- `social.comment` - Comment
- `social.createPost` - Create Post
- `social.post` - Post

**Advocacy** (`advocacy.*`)
- `advocacy.petitions` - Petitions
- `advocacy.stories` - Impact Stories
- `advocacy.sign` - Sign Petition
- `advocacy.signatures` - Signatures

**EcoMarket** (`ecoMarket.*`)
- `ecoMarket.title` - EcoMarket
- `ecoMarket.products` - Products
- `ecoMarket.addToCart` - Add to Cart
- `ecoMarket.buyNow` - Buy Now

**Common** (`common.*`)
- `common.search` - Search
- `common.filter` - Filter
- `common.loading` - Loading...
- `common.save` - Save
- `common.delete` - Delete
- `common.edit` - Edit
- `common.logout` - Logout

**Climate** (`climate.*`)
- `climate.temperature` - Temperature
- `climate.humidity` - Humidity
- `climate.airQuality` - Air Quality
- `climate.aqi` - AQI

## How to Add New Translations

### 1. Add to English file first (`src/locales/en.json`)

```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

### 2. Add translations to all other language files
- `src/locales/hi.json` (Hindi)
- `src/locales/kn.json` (Kannada)
- `src/locales/ta.json` (Tamil)
- `src/locales/te.json` (Telugu)

### 3. Use in your component

```typescript
{t('mySection.myKey')}
```

## Dynamic Values in Translations

Use interpolation for dynamic values:

```typescript
// In translation file:
"greeting": "Hello {{name}}!"

// In component:
{t('greeting', { name: user.name })}
```

## Change Language Programmatically

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { i18n } = useTranslation();
  
  const changeToHindi = () => {
    i18n.changeLanguage('hi');
  };
  
  return <button onClick={changeToHindi}>हिंदी में बदलें</button>;
};
```

## Language Codes

- `en` - English
- `hi` - Hindi (हिंदी)
- `kn` - Kannada (ಕನ್ನಡ)
- `ta` - Tamil (தமிழ்)
- `te` - Telugu (తెలుగు)

## Features

✅ **Automatic Language Detection** - Detects user's browser language
✅ **Persistent Selection** - Saves language choice in localStorage
✅ **Instant Switching** - No page reload needed
✅ **Fallback to English** - If translation missing

## Example: Translating a Page

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      
      <div className="stats">
        <div className="stat">
          <h3>{t('dashboard.carbonSaved')}</h3>
          <p>2,340 kg</p>
        </div>
        
        <div className="stat">
          <h3>{t('dashboard.treesPlanted')}</h3>
          <p>127</p>
        </div>
      </div>
      
      <button>{t('common.save')}</button>
    </div>
  );
};
```

## Testing Different Languages

1. Click the language selector (🌍 Globe icon) in the navbar
2. Select your preferred language
3. All translated text will immediately update
4. Your selection is saved and will persist on page reload

## Need Help?

- Translation files are in: `frontend/src/locales/`
- Configuration is in: `frontend/src/i18n.ts`
- Language switcher component: `frontend/src/components/LanguageSwitcher.tsx`

Happy translating! 🌏✨
