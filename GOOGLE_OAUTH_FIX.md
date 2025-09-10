## Google OAuth ფიქსის სრული ინსტრუქცია

### 1. Google Console-ში შეამოწმეთ:

- შედით https://console.cloud.google.com/apis/credentials
- იპოვნეთ თქვენი OAuth 2.0 Client ID
- "Authorized redirect URIs"-ში უნდა იყოს ᲖᲣᲡᲢᲐᲓ:
  ```
  https://sabapp.com/api/auth/google/callback
  ```

### 2. თუ არ არის დამატებული:

- დააჭირეთ "ADD URI"
- ჩაწერეთ: https://sabapp.com/api/auth/google/callback
- შეინახეთ

### 3. ტესტი:

1. შედით https://sabapp.com
2. დააჭირეთ "Google-ით შესვლა"
3. უნდა იმუშავოს

### 4. თუ კვლავ არ მუშაობს, გამოძახებული:

```
https://sabapp.com/api/debug/oauth-test
```

ეს არის ერთადერთი პრობლემა - Google Console-ის კონფიგურაცია.
Backend და Frontend კოდი სწორია.
