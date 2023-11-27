"use strict";
import validator from "@euriklis/validator";
import { DefaultUserData } from "../types/types";

export const isValidUserData = (user: DefaultUserData) => {
  const phoneNumberRegex: RegExp = /^(\(\d{1,3}\)\s*|[0-9]{1,3}[\s-]*){0,2}\+?[0-9]+$/;
  const isValidUserData = {
    error: false,
    message: "",
    field: "",
  };
  new validator(user)
    .interface({
      firstName: (fname) =>
        fname.isString.and.not.isEmpty
          .on(false, () => {
            isValidUserData.error = true;
            isValidUserData.message = "First name is required";
            isValidUserData.field = "firstName";
          }),
      lastName: (lname) =>
        lname.isString.and.not.isEmpty
          .on(false, () => {
            isValidUserData.error = true;
            isValidUserData.message = "Last name is required";
            isValidUserData.field = "lastName";
          }),
      username: (username) =>
        username.isString.and.hasLengthInClosedRange(5, 35)
          .on(false, () => {
            isValidUserData.error = true;
            isValidUserData.message =
              "The username must be between 5 and 35 charakters in length";
            isValidUserData.field = "username";
          }),
      phone: (phone) =>
        new validator(phoneNumberRegex.test(phone.value)).isSame(true)
          .on(false, () => {
            isValidUserData.error = true;
            isValidUserData.message = "Invalid phone number";
            isValidUserData.field = "phone";
          }),
      email: (email) =>
        email.isEmail
          .on(false, () => {
            isValidUserData.error = true;
            isValidUserData.message = "The email is invalid";
            isValidUserData.field = "email";
          }),
      password: (password) =>
        password.isString.and.hasLengthEqualsOrGreaterThan(8)
          .on(false, () => {
            isValidUserData.error = true;
            isValidUserData.message =
              "The password must be at least 8 charakters";
            isValidUserData.field = "password";
          }),
    });
  return isValidUserData;
};
