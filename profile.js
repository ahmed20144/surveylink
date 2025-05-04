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
const storage = firebase.storage();

// التحقق من حالة تسجيل الدخول
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        // إذا لم يكن المستخدم مسجل، نعيده إلى صفحة تسجيل الدخول
        window.location.href = 'index.html';
        return;
    }

    // التحقق من أن المستخدم مساح
    const surveyorDoc = await db.collection('surveyors').doc(user.uid).get();
    if (!surveyorDoc.exists) {
        window.location.href = 'index.html';
        return;
    }

    // تحميل بيانات الملف الشخصي
    loadProfileData(surveyorDoc.data());
    loadExperiences(user.uid);
    loadProjects(user.uid);
    loadSkills(user.uid);
    loadAvailableJobs();
});

// تحميل بيانات الملف الشخصي
function loadProfileData(data) {
    document.getElementById('surveyor-name').textContent = data.name;
    document.getElementById('surveyor-location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.location}`;
    document.getElementById('surveyor-college').innerHTML = `<i class="fas fa-university"></i> ${data.college}`;
    document.getElementById('rating-value').textContent = data.rating.toFixed(1);
    document.getElementById('completed-jobs').textContent = `(${data.completedJobs} مهمة مكتملة)`;
    
    if (data.profileImage) {
        document.getElementById('profile-image').src = data.profileImage;
    }
}

// تحميل الخبرات
async function loadExperiences(userId) {
    const experienceList = document.getElementById('experience-list');
    const snapshot = await db.collection('surveyors').doc(userId).collection('experiences').get();
    
    experienceList.innerHTML = '';
    snapshot.forEach(doc => {
        const exp = doc.data();
        experienceList.innerHTML += `
            <div class="experience-item">
                <h3>${exp.title}</h3>
                <p>${exp.description}</p>
                <small>${exp.duration}</small>
            </div>
        `;
    });
}

// تحميل المشاريع
async function loadProjects(userId) {
    const projectsGrid = document.getElementById('projects-grid');
    const snapshot = await db.collection('surveyors').doc(userId).collection('projects').get();
    
    projectsGrid.innerHTML = '';
    snapshot.forEach(doc => {
        const project = doc.data();
        projectsGrid.innerHTML += `
            <div class="project-card">
                <img src="${project.image || 'https://via.placeholder.com/300x200'}" alt="${project.title}" class="project-image">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            </div>
        `;
    });
}

// تحميل المهارات
async function loadSkills(userId) {
    const skillsList = document.getElementById('skills-list');
    const snapshot = await db.collection('surveyors').doc(userId).collection('skills').get();
    
    skillsList.innerHTML = '';
    snapshot.forEach(doc => {
        const skill = doc.data();
        skillsList.innerHTML += `
            <div class="skill-item">
                <h3>${skill.name}</h3>
                <div class="skill-level">المستوى: ${skill.level}</div>
            </div>
        `;
    });
}

// تحميل الوظائف المتاحة
async function loadAvailableJobs() {
    const jobsList = document.getElementById('jobs-list');
    const snapshot = await db.collection('jobs').where('status', '==', 'active').get();
    
    jobsList.innerHTML = '';
    snapshot.forEach(doc => {
        const job = doc.data();
        jobsList.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <div class="job-details">
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    <p><i class="fas fa-building"></i> ${job.companyType}</p>
                    <p><i class="fas fa-money-bill-wave"></i> ${job.salary}</p>
                </div>
                <p>${job.description}</p>
                <div class="job-company">
                    <img src="${job.companyLogo || 'https://via.placeholder.com/30'}" alt="${job.companyName}" width="30" height="30">
                    <span>${job.companyName}</span>
                </div>
                <button onclick="applyForJob('${doc.id}')" class="apply-btn">تقديم طلب</button>
            </div>
        `;
    });
}

// تحديث صورة الملف الشخصي
document.getElementById('image-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const user = auth.currentUser;
        const storageRef = storage.ref(`profile-images/${user.uid}`);
        await storageRef.put(file);
        const imageUrl = await storageRef.getDownloadURL();

        await db.collection('surveyors').doc(user.uid).update({
            profileImage: imageUrl
        });

        document.getElementById('profile-image').src = imageUrl;
    } catch (error) {
        console.error('خطأ في تحديث الصورة:', error);
        alert('حدث خطأ في تحديث الصورة');
    }
});

// التقديم على وظيفة
async function applyForJob(jobId) {
    try {
        const user = auth.currentUser;
        await db.collection('job_applications').add({
            jobId: jobId,
            surveyorId: user.uid,
            status: 'pending',
            appliedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('تم تقديم طلبك بنجاح!');
    } catch (error) {
        console.error('خطأ في التقديم على الوظيفة:', error);
        alert('حدث خطأ في تقديم الطلب');
    }
}

// تسجيل الخروج
function logout() {
    auth.signOut().then(() => {
        window.location.href = '/index.html';
    }).catch((error) => {
        console.error('خطأ في تسجيل الخروج:', error);
    });
}

// إضافة خبرة جديدة
function showAddExperienceModal() {
    // هنا يمكنك إضافة كود لإظهار نافذة منبثقة لإضافة خبرة جديدة
    alert('سيتم إضافة نافذة منبثقة لإضافة خبرة جديدة');
}

// إضافة مشروع جديد
function showAddProjectModal() {
    // هنا يمكنك إضافة كود لإظهار نافذة منبثقة لإضافة مشروع جديد
    alert('سيتم إضافة نافذة منبثقة لإضافة مشروع جديد');
}

// إضافة مهارة جديدة
function showAddSkillModal() {
    // هنا يمكنك إضافة كود لإظهار نافذة منبثقة لإضافة مهارة جديدة
    alert('سيتم إضافة نافذة منبثقة لإضافة مهارة جديدة');
} 