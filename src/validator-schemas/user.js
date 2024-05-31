import * as yup from "yup";

export const user = yup.object().shape({
    name: yup.string().required("Обязательное поле!"),
    passportPersonalNumber: yup.string().required("Обязательное поле!"),
    passportPersonalSeries: yup.string().required("Обязательное поле!"),
    passportValidity: yup.date().required("Обязательное поле!"),
    dateOfBirth: yup.date().required("Обязательное поле!"),
});
