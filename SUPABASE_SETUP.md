# إعداد قاعدة بيانات Supabase لمشروع Surveylink

## الخطوات

### 1. إنشاء حساب وتسجيل الدخول
- قم بالتسجيل أو تسجيل الدخول على [موقع Supabase](https://supabase.com)

### 2. إنشاء مشروع جديد
- انقر على زر "New Project"
- أدخل اسم المشروع (مثل "surveylink")
- أدخل كلمة مرور قوية
- اختر المنطقة الجغرافية الأقرب إليك
- انقر على "Create new project"

### 3. إعداد قاعدة البيانات
بعد إنشاء المشروع، قم بتنفيذ هذه الخطوات:

1. انتقل إلى قسم "SQL Editor" من القائمة الجانبية
2. انقر على "New Query"
3. انسخ محتوى ملف `supabase_schema.sql` إلى محرر SQL
4. انقر على "Run" لتنفيذ الاستعلام

### 4. مراجعة الجداول
- انتقل إلى "Table Editor" في القائمة الجانبية
- تأكد من إنشاء جميع الجداول المطلوبة بنجاح

### 5. الحصول على معلومات الاتصال
للاتصال بقاعدة البيانات من التطبيق، ستحتاج إلى:

1. انتقل إلى "Project Settings" من القائمة
2. انتقل إلى قسم "API"
3. انسخ القيم التالية:
   - عنوان URL للمشروع (`https://your-project-id.supabase.co`)
   - مفتاح anon key
   - مفتاح service role key (للعمليات الإدارية فقط)

### 6. تحديث إعدادات التطبيق
قم بتعديل ملف `.env.supabase` باستخدام المعلومات التي حصلت عليها:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SECRET=your-service-role-key
```

### 7. إضافة مكتبة Supabase للمشروع
قم بتثبيت مكتبة Supabase لـ Node.js:

```bash
npm install @supabase/supabase-js
```

### 8. إعداد الاتصال بقاعدة البيانات
قم بإنشاء ملف تكوين للاتصال بـ Supabase:

```javascript
// src/config/supabase.config.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseSecret = process.env.SUPABASE_SECRET;

// للاستخدام العام (قراءة البيانات العامة)
const supabase = createClient(supabaseUrl, supabaseKey);

// للعمليات الإدارية (مع صلاحيات كاملة)
const supabaseAdmin = createClient(supabaseUrl, supabaseSecret);

module.exports = { supabase, supabaseAdmin };
```

## ملاحظات أمان مهمة

1. **سياسات الأمان (RLS)**: تأكد من تكوين سياسات الأمان (Row Level Security) المناسبة في Supabase. قمنا بتمكين RLS لجميع الجداول لكن يجب تكوين السياسات المناسبة.

2. **المفاتيح السرية**: لا تستخدم `service role key` في تطبيق الواجهة الأمامية أبداً، هذا المفتاح له صلاحيات كاملة على قاعدة البيانات.

3. **التحقق من الهوية**: يُوصى باستخدام نظام التحقق من الهوية المدمج في Supabase للتعامل مع تسجيل الدخول والتسجيل بدلاً من تنفيذ ذلك يدوياً.

## استخدام RLS (Row Level Security)

لإعداد سياسات الأمان المناسبة، قم بتنفيذ استعلامات SQL إضافية. على سبيل المثال:

```sql
-- سياسة أمان للمستخدمين
CREATE POLICY "المستخدمون يمكنهم رؤية ملفاتهم الشخصية فقط"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- سياسة أمان للمنشورات
CREATE POLICY "المنشورات العامة يمكن للجميع رؤيتها"
  ON posts
  FOR SELECT
  USING (true);
```

## الخطوات التالية

بعد إعداد قاعدة البيانات:

1. قم بتعديل نماذج التطبيق لاستخدام Supabase بدلاً من Sequelize
2. قم بتحديث وحدات التحكم للتعامل مع Supabase
3. أنشئ سياسات RLS المناسبة لحماية بياناتك 