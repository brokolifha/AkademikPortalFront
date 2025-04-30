import { isEmpty, isEmptyArray, isNullOrUndefined } from "./helpers";

// 👉 Required Validator
export const requiredValidator = (value) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return "Bu alan zorunludur";

  return !!String(value).trim().length || "Bu alan zorunludur";
};

// 👉 Email Validator
export const emailValidator = (value) => {
  if (isEmpty(value)) return true;
  const re =
    /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i;
  if (Array.isArray(value))
    return (
      value.every((val) => re.test(String(val))) || "E-posta adresi geçersiz"
    );

  return re.test(String(value)) || "Email adresi geçersiz";
};

// 👉 Password Validator
export const passwordValidator = (password) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
  const validPassword = regExp.test(password);

  return (
    validPassword ||
    "Alan en az bir büyük harf, küçük harf, özel karakter ve rakam içermeli ve en az 8 karakter uzunluğunda olmalıdır"
  );
};

// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) =>
  value === target || "Şifre doğrulama alanı eşleşmiyor";

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
  const valueAsNumber = Number(value);

  return (
    (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) ||
    `${min} ile ${max} arasında bir sayı girin`
  );
};

// 👉 Integer Validator
export const integerValidator = (value) => {
  if (isEmpty(value)) return true;
  if (Array.isArray(value))
    return (
      value.every((val) => /^-?\d+$/.test(String(val))) ||
      "Bu alan bir tam sayı olmalıdır"
    );

  return /^-?\d+$/.test(String(value)) || "Bu alan bir tam sayı olmalıdır";
};

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
  if (isEmpty(value)) return true;
  let regeX = regex;
  if (typeof regeX === "string") regeX = new RegExp(regeX);
  if (Array.isArray(value))
    return value.every((val) => regexValidator(val, regeX));

  return regeX.test(String(value)) || "Regex alan formatı geçersiz";
};

// 👉 Alpha Validator
export const alphaValidator = (value) => {
  if (isEmpty(value)) return true;

  return (
    /^[A-Z]*$/i.test(String(value)) ||
    "Alpha alanı yalnızca alfabetik karakterler içerebilir"
  );
};

// 👉 URL Validator
export const urlValidator = (value) => {
  if (isEmpty(value)) return true;
  const re = /^https?:\/\/[^\s$.?#].\S*$/;

  return re.test(String(value)) || "URL geçersiz";
};

// 👉 Length Validator
export const lengthValidator = (value, length) => {
  if (isEmpty(value)) return true;

  return (
    String(value).length === length ||
    `"Karakterler alanının uzunluğu ${length} karakter olmalıdır."`
  );
};

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value) => {
  if (isEmpty(value)) return true;
  const valueAsString = String(value);

  return /^[\w-]*$/.test(valueAsString) || "Tüm karakterler geçerli değil";
};
