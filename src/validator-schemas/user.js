import * as yup from "yup";

export const user = yup.object().shape({
    name: yup.string(),
    passportPersonalNumber: yup.string().required(),
    passportPersonalSeries: yup.string().required(),
    passportValidity: yup.date().required(),
    dateOfBirth: yup.date().required(),
});
