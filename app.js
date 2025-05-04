// تكوين Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCoOREUmwtEtb6oq1Yb4UqNamXYERLL2qg",
    authDomain: "servey-cooect.firebaseapp.com",
    projectId: "servey-cooect",
    storageBucket: "servey-cooect.firebasestorage.app",
    messagingSenderId: "422475242163",
    appId: "1:422475242163:web:859dc77a6e3e01b1066ec6",
    measurementId: "G-674P1SW94D"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// إنشاء مزود خدمة Google
const googleProvider = new firebase.auth.GoogleAuthProvider();

// دالة تسجيل الدخول باستخدام Google
function signInWithGoogle(type) {
    console.log("تم الضغط على زر تسجيل الدخول بـ Google، النوع:", type);
    alert("جاري فتح نافذة تسجيل الدخول بـ Google...");
    
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            console.log("تم تسجيل الدخول بنجاح:", user.displayName);
            
            // التحقق مما إذا كان المستخدم موجود بالفعل
            return Promise.all([
                db.collection('surveyors').doc(user.uid).get(),
                db.collection('companies').doc(user.uid).get(),
                Promise.resolve(user)
            ]);
        })
        .then(([surveyorDoc, companyDoc, user]) => {
            if (!surveyorDoc.exists && !companyDoc.exists) {
                // مستخدم جديد - إنشاء ملف تعريف حسب النوع
                if (type === 'surveyor') {
                    return db.collection('surveyors').doc(user.uid).set({
                        name: user.displayName || '',
                        email: user.email,
                        type: 'surveyor',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        rating: 0,
                        completedJobs: 0,
                        profileImage: user.photoURL || ''
                    }).then(() => {
                        window.location.href = 'surveyor-profile.html';
                    });
                } else if (type === 'company') {
                    return db.collection('companies').doc(user.uid).set({
                        name: user.displayName || '',
                        email: user.email,
                        type: 'company',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        postedJobs: 0,
                        profileImage: user.photoURL || ''
                    }).then(() => {
                        window.location.href = 'company-dashboard.html';
                    });
                }
            } else {
                // مستخدم موجود - توجيه للصفحة المناسبة
                if (surveyorDoc.exists) {
                    window.location.href = 'surveyor-profile.html';
                } else if (companyDoc.exists) {
                    window.location.href = 'company-dashboard.html';
                }
            }
        })
        .catch((error) => {
            console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
            alert("حدث خطأ في تسجيل الدخول: " + error.message);
        });
}

// دالة تسجيل الدخول المباشر
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // التحقق من نوع المستخدم
        const surveyorDoc = await db.collection('surveyors').doc(user.uid).get();
        const companyDoc = await db.collection('companies').doc(user.uid).get();

        if (surveyorDoc.exists) {
            window.location.href = 'surveyor-profile.html';
        } else if (companyDoc.exists) {
            window.location.href = 'company-dashboard.html';
        }
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        alert("خطأ في تسجيل الدخول: " + error.message);
    }
}

// دالة لإظهار نموذج التسجيل المناسب
function showRegistration(type) {
    // إخفاء كل النماذج أولاً
    document.getElementById('surveyor-form').style.display = 'none';
    document.getElementById('company-form').style.display = 'none';
    
    // إظهار النموذج المطلوب
    document.getElementById(`${type}-form`).style.display = 'block';
}

// دالة لتسجيل المساح
async function registerSurveyor(event) {
    event.preventDefault();
    
    const email = document.getElementById('surveyor-email').value;
    const password = document.getElementById('surveyor-password').value;
    const name = document.getElementById('surveyor-name').value;
    const location = document.getElementById('surveyor-location').value;
    const college = document.getElementById('surveyor-college').value;

    try {
        // إنشاء حساب المستخدم
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // إضافة معلومات المساح إلى Firestore
        await db.collection('surveyors').doc(user.uid).set({
            name: name,
            email: email,
            location: location,
            college: college,
            type: 'surveyor',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            rating: 0,
            completedJobs: 0
        });

        // تحويل المستخدم إلى صفحة الملف الشخصي
        window.location.href = 'surveyor-profile.html';
    } catch (error) {
        console.error("خطأ في تسجيل المساح:", error);
        alert("حدث خطأ في التسجيل: " + error.message);
    }
}

// دالة لتسجيل الشركة
async function registerCompany(event) {
    event.preventDefault();
    
    const email = document.getElementById('company-email').value;
    const password = document.getElementById('company-password').value;
    const name = document.getElementById('company-name').value;
    const type = document.getElementById('company-type').value;
    const location = document.getElementById('company-location').value;

    try {
        // إنشاء حساب المستخدم
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // إضافة معلومات الشركة إلى Firestore
        await db.collection('companies').doc(user.uid).set({
            name: name,
            email: email,
            type: type,
            location: location,
            userType: 'company',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            postedJobs: 0
        });

        // تحويل المستخدم إلى صفحة لوحة التحكم
        window.location.href = 'company-dashboard.html';
    } catch (error) {
        console.error("خطأ في تسجيل الشركة:", error);
        alert("حدث خطأ في التسجيل: " + error.message);
    }
}

// إضافة مستمعي الأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل الصفحة");
    
    const surveyorForm = document.getElementById('surveyorRegistrationForm');
    const companyForm = document.getElementById('companyRegistrationForm');
    
    if (surveyorForm) {
        surveyorForm.addEventListener('submit', registerSurveyor);
    }
    
    if (companyForm) {
        companyForm.addEventListener('submit', registerCompany);
    }

    // إضافة مستمعي أحداث للأزرار
    const surveyorButton = document.querySelector('#surveyor-card .google-btn');
    const companyButton = document.querySelector('#company-card .google-btn');
    
    if (surveyorButton) {
        console.log("تم العثور على زر المساح");
        surveyorButton.addEventListener('click', () => {
            console.log("تم النقر على زر المساح");
            signInWithGoogle('surveyor');
        });
    }
    
    if (companyButton) {
        console.log("تم العثور على زر الشركة");
        companyButton.addEventListener('click', () => {
            console.log("تم النقر على زر الشركة");
            signInWithGoogle('company');
        });
    }

    // التحقق من حالة تسجيل الدخول
    auth.onAuthStateChanged(async user => {
        if (user) {
            console.log("المستخدم مسجل دخوله:", user.displayName);
            try {
                // التحقق من نوع المستخدم وتوجيهه للصفحة المناسبة
                const surveyorDoc = await db.collection('surveyors').doc(user.uid).get();
                const companyDoc = await db.collection('companies').doc(user.uid).get();

                if (surveyorDoc.exists) {
                    window.location.href = 'surveyor-profile.html';
                } else if (companyDoc.exists) {
                    window.location.href = 'company-dashboard.html';
                }
            } catch (error) {
                console.error("خطأ في التحقق من نوع المستخدم:", error);
            }
        } else {
            console.log("لا يوجد مستخدم مسجل الدخول");
        }
    });
});

// مثال على دالة لقراءة البيانات من Firestore
async function loadData() {
    try {
        const contentDiv = document.getElementById('content');
        console.log("جاري محاولة قراءة البيانات من Firestore...");
        
        // قراءة البيانات من مجموعة service
        const snapshot = await db.collection('service').get();
        console.log("تم الاتصال بمجموعة service بنجاح!");
        
        if (snapshot.empty) {
            contentDiv.innerHTML = '<p>لا توجد بيانات متاحة في مجموعة service</p>';
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log("تم العثور على مستند:", doc.id, data);
            html += `
                <div class="item">
                    <h3>${data.title || 'بدون عنوان'}</h3>
                    <p>${data.description || 'بدون وصف'}</p>
                </div>
            `;
        });

        contentDiv.innerHTML = html;
    } catch (error) {
        console.error("حدث خطأ في قراءة البيانات:", error);
        document.getElementById('content').innerHTML = `
            <p>حدث خطأ في تحميل البيانات</p>
            <p class="error-details">${error.message}</p>
        `;
    }
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadData); 