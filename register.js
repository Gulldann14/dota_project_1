// ========================================
// 1. НАХОДИМ ВСЕ ЭЛЕМЕНТЫ
// ========================================
const form = document.querySelector("#registerForm");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirm = document.querySelector("#confirm");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmError = document.querySelector("#confirmError");

const submitBtn = document.querySelector("#submitBtn");
const togglePassword = document.querySelector("#togglePassword");

// Элементы для шкалы сложности пароля (их не хватало!)
const strengthFill = document.querySelector("#strengthFill");
const strengthText = document.querySelector("#strengthText");

// Элементы согласия с условиями
const terms = document.querySelector("#terms");
const termsError = document.querySelector("#termsError");

// ========================================
// 2. ФУНКЦИИ ВАЛИДАЦИИ
// ========================================
const validateUsername = (value) => {
    const trimmed = value.trim();
    if (trimmed === "") return { valid: false, message: "Введите имя" };
    if (trimmed.length < 3) return { valid: false, message: "Минимум 3 символа" };
    if (trimmed.length > 20) return { valid: false, message: "Максимум 20 символов" };
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) return { valid: false, message: "Только буквы, цифры и _" };
    return { valid: true, message: "" };
};

const validateEmail = (value) => {
    const trimmed = value.trim();
    if (trimmed === "") return { valid: false, message: "Введите email" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { valid: false, message: "Неверный email" };
    return { valid: true, message: "" };
};

const validatePassword = (value) => {
    if (value === "") return { valid: false, message: "Введите пароль" };
    if (value.length < 8) return { valid: false, message: "Минимум 8 символов" };
    if (!/[a-zA-Z]/.test(value)) return { valid: false, message: "Добавьте букву" };
    if (!/\d/.test(value)) return { valid: false, message: "Добавьте цифру" };
    return { valid: true, message: "" };
};

const validateConfirm = (value) => {
    if (value === "") return { valid: false, message: "Повторите пароль" };
    if (value !== password.value) return { valid: false, message: "Пароли не совпадают" };
    return { valid: true, message: "" };
};

const validateTerms = () => {
    if (!terms.checked) {
        return { valid: false, message: "Отметьте согласие" };
    }
    return { valid: true, message: "" };
};

// ========================================
// 3. ОТОБРАЖЕНИЕ ОШИБОК
// ========================================
const showError = (input, errorElement, message) => {
    input.classList.add("error");
    input.classList.remove("success");
    errorElement.textContent = message;
};

const showSuccess = (input, errorElement) => {
    input.classList.remove("error");
    input.classList.add("success");
    errorElement.textContent = "";
};

// ========================================
// 4. ОБЩАЯ ПРОВЕРКА ФОРМЫ
// ========================================
const validateForm = () => {
    const r1 = validateUsername(username.value);
    const r2 = validateEmail(email.value);
    const r3 = validatePassword(password.value);
    const r4 = validateConfirm(confirm.value);
    const r5 = validateTerms(); // Проверка галочки

    if (r1.valid) showSuccess(username, usernameError); else showError(username, usernameError, r1.message);
    if (r2.valid) showSuccess(email, emailError); else showError(email, emailError, r2.message);
    if (r3.valid) showSuccess(password, passwordError); else showError(password, passwordError, r3.message);
    if (r4.valid) showSuccess(confirm, confirmError); else showError(confirm, confirmError, r4.message);
    
    // Отдельно для чекбокса (у него нет input, только change)
    if (r5.valid) {
        termsError.textContent = "";
    } else {
        termsError.textContent = r5.message;
    }

    const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
    submitBtn.disabled = !allValid;
    
    return allValid;
};

// ========================================
// 5. ИНДИКАТОР СЛОЖНОСТИ ПАРОЛЯ
// ========================================
const checkStrength = (value) => {
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
    if (/\d/.test(value)) strength++;
    if (/[^a-zA-Z0-9]/.test(value)) strength++;
    return strength;
};

const levels = [
    { width: "0%",   color: "#eee",    text: "Введите пароль" },
    { width: "25%",  color: "#e74c3c", text: "Очень слабый" },
    { width: "50%",  color: "#f39c12", text: "Слабый" },
    { width: "75%",  color: "#3498db", text: "Средний" },
    { width: "100%", color: "#27ae60", text: "Сильный" }
];

const updateStrength = (value) => {
    const strength = checkStrength(value);
    const level = levels[strength];

    // Теперь эти переменные существуют, и код не упадет
    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = level.text;
    strengthText.style.color = level.color;
};

// ========================================
// 6. СОБЫТИЯ
// ========================================
// Валидация при вводе
[username, email, password, confirm].forEach((input) => {
    input.addEventListener("input", validateForm);
});

// Слушатель для чекбокса
terms.addEventListener("change", validateForm);

// Обновление шкалы сложности при вводе пароля
password.addEventListener("input", (event) => {
    updateStrength(event.target.value);
});

// Показать/скрыть пароль
togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "✕";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁️";
    }
});

// Отправка формы
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    if (validateForm()) {
        alert("Регистрация успешна!");
        
        form.reset();
        submitBtn.disabled = true;
        updateStrength(""); // Сброс шкалы пароля
        
        [username, email, password, confirm].forEach((input) => {
            input.classList.remove("success");
        });
    }
});
username.focus();
