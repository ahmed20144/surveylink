# SurveyLink - منصة ربط المساحين والشركات الهندسية

نظام ويب متكامل لربط المساحين والشركات الهندسية وتسهيل التعاون بينهم. المنصة تتيح للمساحين عرض خدماتهم ومهاراتهم، وللشركات نشر مشاريعها ووظائفها، مع نظام مزادات ومجتمع متخصص.

## المتطلبات الأساسية

- Node.js v14+
- MySQL v8+
- Supabase
- وصول لإنترنت

## إعداد المشروع

### 1. استنساخ المشروع

```bash
git clone https://github.com/yourusername/surveylink.git
cd surveylink
```

### 2. إعداد قاعدة بيانات Supabase

1. قم بإنشاء حساب على [Supabase](https://supabase.io)
2. أنشئ مشروعًا جديدًا
3. استخدم ملفات SQL الموجودة لإنشاء هيكل قاعدة البيانات:

```bash
# قم بتنفيذ الملفات التالية في SQL Editor على منصة Supabase
supabase_schema.sql
supabase_rls_policies.sql
```

### 3. إعداد مزودي المصادقة (OAuth)

1. **إعداد مصادقة جوجل**:
   - انتقل إلى [Google Cloud Console](https://console.cloud.google.com/)
   - أنشئ مشروعًا جديدًا
   - انتقل إلى "Credentials" (بيانات الاعتماد) وأنشئ OAuth Client ID جديد
   - أضف عنوان URI المصرح به للتحويل: `https://your-supabase-project.supabase.co/auth/v1/callback`
   - احفظ Client ID و Client Secret

2. **إعداد مصادقة فيسبوك**:
   - انتقل إلى [Facebook Developers](https://developers.facebook.com/)
   - أنشئ تطبيقًا جديدًا
   - انتقل إلى "Facebook Login" وقم بإعداده
   - أضف عنوان URI لإعادة التوجيه: `https://your-supabase-project.supabase.co/auth/v1/callback`
   - احفظ App ID و App Secret

3. **تكوين مزودي المصادقة في Supabase**:
   - انتقل إلى لوحة تحكم Supabase
   - اذهب إلى Authentication > Providers
   - فعّل Google وأدخل Client ID و Client Secret
   - فعّل Facebook وأدخل App ID و App Secret

### 4. تكوين متغيرات البيئة

قم بنسخ ملف `.env.example` إلى `.env` وتعديل الإعدادات حسب بيئتك:

```bash
cp backend/.env.example backend/.env
```

عدل ملف `.env` بمعلومات الاتصال بقاعدة البيانات Supabase ومزودي المصادقة:

```
SUPABASE_URL=https://your-supabase-project-url.supabase.co
SUPABASE_KEY=your-supabase-anon-key
SUPABASE_GOOGLE_CLIENT_ID=your-google-client-id
SUPABASE_GOOGLE_SECRET=your-google-client-secret
SUPABASE_FACEBOOK_CLIENT_ID=your-facebook-app-id
SUPABASE_FACEBOOK_SECRET=your-facebook-app-secret
```

### 5. تعديل روابط إعادة التوجيه

افتح ملف `js/supabase.js` وتأكد من تحديث `redirectTo` بعنوان موقعك:

```javascript
// تعديل عنوان إعادة التوجيه حسب موقعك المستضاف
options: {
    redirectTo: 'https://your-github-pages-url.github.io'
}
```

### 6. تشغيل المشروع للتطوير

```bash
# تشغيل خادم التطوير المحلي
npx http-server -p 8080
```

سيعمل الموقع على المنفذ 8080 افتراضيًا، ويمكن الوصول إليه من خلال:
http://localhost:8080

## قائمة صفحات الموقع

1. **الصفحة الرئيسية** - `index.html`: صفحة تسجيل الدخول وإنشاء حساب جديد
2. **لوحة تحكم المساح** - `surveyor-dashboard.html`: لوحة تحكم خاصة بالمساحين
3. **لوحة تحكم الشركة** - `company-dashboard.html`: لوحة تحكم خاصة بالشركات
4. **صفحة المشاريع** - `projects.html`: عرض وإدارة المشاريع
5. **صفحة الوظائف** - `jobs.html`: عرض وإدارة الوظائف
6. **صفحة المزادات** - `auctions.html`: عرض وإدارة المزادات
7. **صفحة المعدات** - `equipment.html`: عرض وإدارة المعدات
8. **صفحة المجتمع** - `community.html`: منتدى خاص بالمساحين والشركات
9. **خريطة المشاريع** - `map-projects.html`: عرض المشاريع على الخريطة
10. **صفحة الاتصال** - `contact.html`: نموذج للتواصل مع إدارة الموقع

## وصف قاعدة البيانات

تتضمن قاعدة البيانات الجداول الرئيسية التالية:

1. **users**: معلومات المستخدمين الأساسية (المساحين والشركات والمديرين)
2. **surveyors**: معلومات المساحين التفصيلية
3. **companies**: معلومات الشركات التفصيلية
4. **projects**: المشاريع المسجلة في النظام
5. **jobs**: الوظائف المعلن عنها
6. **auctions**: المزادات المفتوحة للمشاريع
7. **posts**: منشورات المجتمع
8. **skills**: المهارات المتاحة في النظام
9. **ratings**: تقييمات المستخدمين
10. **contact_messages**: رسائل الاتصال المرسلة من نموذج الاتصال

## التعديلات الجديدة

- تم إضافة صفحة اتصل بنا مع نموذج للتواصل
- تم تحسين حجم القائمة الرئيسية للموقع
- تم تحسين تقييد الوصول للصفحات (مطلوب تسجيل الدخول)
- تم إضافة جدول رسائل الاتصال في قاعدة البيانات
- تم توحيد تصميم الموقع بمقاسات وألوان مناسبة
- **تم إضافة دعم تسجيل الدخول بواسطة جوجل وفيسبوك**

## رفع الموقع (النشر)

### الخيار 1: GitHub Pages (مجاناً)
1. أنشئ حساباً على [GitHub](https://github.com/)
2. أنشئ مستودعاً (repository) جديداً
3. ارفع ملفات الموقع للمستودع
4. فعّل GitHub Pages من إعدادات المستودع
5. **هام**: تأكد من تحديث ملف `js/supabase.js` بعنوان موقعك على GitHub Pages في `redirectTo`

### الخيار 2: Netlify (مجاناً)
1. أنشئ حساباً على [Netlify](https://www.netlify.com/)
2. اضغط على "New site from Git" أو قم برفع مجلد الموقع مباشرة
3. اضبط متغيرات البيئة الخاصة بـ Supabase
4. **هام**: تأكد من تحديث ملف `js/supabase.js` بعنوان موقعك على Netlify في `redirectTo`

### الخيار 3: استضافة مدفوعة
استخدم خدمات مثل Hostinger أو Bluehost لرفع الملفات عبر FTP

## حل المشكلات الشائعة

### مشكلة تسجيل الدخول عبر OAuth
إذا واجهت مشكلة عند تسجيل الدخول بواسطة جوجل أو فيسبوك:
1. تأكد من إعداد عناوين الموقع المسموح بها بشكل صحيح في إعدادات مزودي المصادقة
2. تأكد من أن روابط إعادة التوجيه (redirectTo) تشير إلى عنوان موقعك الفعلي
3. تحقق من السجلات (logs) في لوحة تحكم Supabase > Authentication > Auth Logs

### مشكلة "خطأ غير متوقع" عند تسجيل الدخول
1. تأكد من تشغيل الموقع عبر HTTPS (مهم لـ OAuth)
2. تأكد من تكوين Supabase بشكل صحيح للسماح بالمصادقة من النطاق المستضاف عليه موقعك

## المساهمة

نرحب بمساهماتكم في تطوير المشروع! يرجى اتباع الخطوات التالية:

1. افتح issue جديد لمناقشة التغيير المقترح
2. اعمل fork للمشروع
3. اعمل على فرع (branch) جديد
4. قم بعمل التغييرات
5. اعمل pull request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) لمزيد من التفاصيل.

## التواصل

لأي استفسارات، يرجى التواصل عبر: info@surveylink.com 