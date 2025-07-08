# 🔧 Google Cloud Console - კონფიგურაციის ინსტრუქცია

## ❌ მიმდინარე პრობლემა:

```
GET https://accounts.google.com/oauth/authorize?client_id=675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsaba-app-production.up.railway.app%2Fauth%2Fgoogle%2Fcallback&response_type=code&scope=openid%20email%20profile&state=lgb8xr 404 (Not Found)
```

**მიზეზი**: Google Cloud Console-ში არ არის კონფიგურირებული production redirect URI.

## 🔧 გადაწყვეტის ნაბიჯები:

### 1. Google Cloud Console-ში შესვლა:

- გადადი: https://console.cloud.google.com/
- აირჩიე შენი project (SabApp ან რომელიც გაქვს)

### 2. OAuth 2.0 Client IDs-ის პოვნა:

- წარმართე: **APIs & Services** > **Credentials**
- მოძებნე OAuth 2.0 Client IDs სექციაში შენი client:
  - Client ID: `675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com`

### 3. Client-ის რედაქტირება:

OAuth client-ზე დაკლიკების შემდეგ:

#### **Authorized JavaScript origins** სექციაში დაამატე:

```
https://saba-app-production.up.railway.app
```

#### **Authorized redirect URIs** სექციაში დაამატე:

```
https://saba-app-production.up.railway.app/auth/google/callback
```

### 4. შენახვა:

- დააჭირე **SAVE** ღილაკს
- ცვლილებების ძალაში შესვლას შეიძლება რამდენიმე წუთი დასჭირდეს

## ✅ მოსალოდნელი შედეგი:

ცვლილებების შემდეგ:

1. 404 შეცდომა აღარ იქნება
2. Google OAuth redirect flow იმუშავებს production-ში
3. მომხმარებლები შეძლებენ Google-ით შესვლას

## 🧪 ტესტირება:

ცვლილებების შემდეგ:

1. წადი: https://saba-app-production.up.railway.app
2. დააჭირე "Google-ით შესვლა" ღილაკს
3. Google-მა უნდა გადაგიყვანოს ავტორიზაციის გვერდზე
4. ავტორიზაციის შემდეგ უნდა დაბრუნდე საიტზე

## 📋 მნიშვნელოვანი:

- ეს არის მანუალური ნაბიჯი, რომელიც Google Cloud Console-ში უნდა გაკეთდეს
- კოდში ყველაფერი სწორად არის კონფიგურირებული
- პრობლემა მხოლოდ Google-ის მხრიდან authorization-ის არ არსებობაშია

## 🔍 Client ID დეტალები:

თუ Google Console-ში ვერ პოულობ client-ს, მოძებნე:

- Client ID: `675742559993-5quocp5mgvmog0fd2g8ue03vpleb23t5.apps.googleusercontent.com`
- Project: SabApp (ან შენი project-ის სახელი)
