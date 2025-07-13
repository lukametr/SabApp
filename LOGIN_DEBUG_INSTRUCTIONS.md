# ავტორიზაციის პრობლემის მოგვარების ინსტრუქცია

## პრობლემის აღწერა

მომხმარებელი შედის სისტემაში მეილით/პაროლით, შემდეგ გამოდის, და როცა ისევ ცდილობს შესვლას იგივე მონაცემებით, აღარ უშვებს (ეუბნება "არასწორი პაროლი ან მეილია").

## შესაძლო მიზეზები

### 1. Browser Cache/localStorage პრობლემა

- **გამოსავალი**: Browser-ის cache-ის და localStorage-ის გასუფთავება
- **ნაბიჯები**:
  1. F12 → Console → localStorage.clear() → Enter
  2. F12 → Application → Storage → Clear site data
  3. ან სრულიად Ctrl+Shift+Delete → Clear browsing data

### 2. Session Management პრობლემა

- **ტესტი**: სხვა browser ან incognito mode-ში შემოწმება
- **გამოსავალი**: თუ სხვა browser-ში მუშაობს, პირველ browser-ს cache გასუფთავება

### 3. Network/API პრობლემა

- **ტესტი**: F12 → Network ტაბზე login მცდელობის დროს Network requests-ის გადამოწმება
- **ძებნილი რა**: 200/401 status code, response error message

### 4. JWT Token ვადის გასვლა

- **მიზეზი**: ძველი token localStorage-ში რჩება და ახალ login-ს ხელს უშლის
- **გამოსავალი**: localStorage-ის სრული გასუფთავება

## ტესტის ინსტრუქცია

1. **პირველი ტესტი** - Browser Cache გასუფთავება:

   ```
   - F12 → Console
   - localStorage.clear()
   - sessionStorage.clear()
   - ხელახლა ცადეთ შესვლა
   ```

2. **მეორე ტესტი** - Incognito Mode:

   ```
   - გახსენით Incognito/Private window
   - გადადით ვებსაიტზე
   - ცადეთ შესვლა
   ```

3. **მესამე ტესტი** - სხვა Browser:

   ```
   - გამოიყენეთ სრულიად სხვა browser
   - ცადეთ შესვლა
   ```

4. **მეოთხე ტესტი** - Debug Mode:
   ```
   - F12 → Console
   - ცადეთ შესვლა
   - იხილეთ console errors/logs
   - F12 → Network → ცადეთ შესვლა
   - მოძებნეთ /api/auth/login request და მისი response
   ```

## კოდში დაემატა debug logging

Frontend-ში დამატებულია დეტალური ლოგები:

- 🔐 Login attempt
- 🌐 API Login request/response
- 🗃️ AuthStore operations

Backend-ში დამატებულია დეტალური ლოგები:

- 🔐 Email Login process
- Password comparison result
- User lookup details

## შემდეგი ნაბიჯები

1. მომხმარებელმა უნდა ცადოს ზემოაღნიშნული ტესტები
2. Console logs-ის გაზიარება debug-ისთვის
3. Network requests-ის status codes გადამოწმება
4. საჭიროების შემთხვევაში backend logs-ის გადამოწმება

## დროებითი გამოსავალი

თუ პრობლემა მაინც გრძელდება:

1. **სრული browser reset**: Settings → Reset browser to defaults
2. **სხვა device-იდან ტესტი**: მობილური ან სხვა კომპიუტერი
3. **პაროლის განულება**: "forgot password" ფუნქციის გამოყენება

## ტექნიკური დეტალები

- Frontend: React + Next.js + Zustand (localStorage for auth state)
- Backend: NestJS + JWT + bcrypt
- Database: MongoDB
- Auth Flow: Email/Password → bcrypt.compare → JWT token → localStorage
