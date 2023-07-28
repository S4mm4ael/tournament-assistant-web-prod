import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useController, useForm } from 'react-hook-form';

import styles from './registration-page.module.css';

export function RegistrationPage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const hasUpperCaseLetter = (value: string) => /[A-ZА-Я]/.test(value);
  const hasNumber = (value: string) => /\d+/.test(value);
  const minLength = (value: string) => /^(?=.*\d).{8,}$/.test(value);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'all' });

  const { field: emailField, fieldState: emailFieldState } = useController({
    name: 'email',
    control,
    rules: {
      required: true,
      pattern: /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  });

  const { field: passwordField, fieldState: passwordFieldState } = useController({
    name: 'password',
    control,
    rules: {
      required: true,
      minLength: { value: 8, message: 'Password must be at least 8 characters' },
      validate: {
        hasUpperCaseLetter,
        hasNumber,
        minLength,
      },
    },
  });
  const onSubmit = () => {
    if (!emailFieldState.invalid && !passwordFieldState.invalid) {
      setEmail(emailField.value);
      setPassword(passwordField.value);
      registrationWithPassword();
    }
  };
  async function registrationWithPassword() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ..
      });
  }

  return (
    <div className={styles.RegistrationPage}>
      <h1>Registration</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.RegistrationPage__inputWrapper}>
          <label htmlFor="e-mail" className={styles.RegistrationPage__placeholder}>
            E-mail
          </label>
          <input
            className={styles.RegistrationPage__formItem}
            key="email"
            {...emailField}
            value={emailField.value || ''}
            type="text"
            required={true}
            id="e-mail"
          />

          {!emailFieldState.invalid && <p className={styles.RegistrationPage__formTips}></p>}
          {emailFieldState.invalid && (
            <p
              className={`${styles.RegistrationPage__formTips} ${styles.RegistrationPage__formTips_error}`}
            >
              Enter correct e-mail
            </p>
          )}
        </div>
        <div className={styles.RegistrationPage__inputWrapper}>
          <label htmlFor="password" className={styles.RegistrationPage__placeholder}>
            Password
          </label>
          <input
            key="password"
            id="password"
            {...passwordField}
            value={passwordField.value || ''}
            onChange={passwordField.onChange}
            className={styles.RegistrationPage__formItem}
            type={'password'}
            required={true}
            autoFocus={true}
          />
          {passwordFieldState.invalid && (
            <p
              className={`${styles.RegistrationPage__formTips} ${styles.RegistrationPage__formTips_error}`}
            >
              Password must be at least 8 characters, has upper case letter and has a number.
            </p>
          )}
        </div>
        <div className={styles.RegistrationPage__inputWrapper}>
          <label htmlFor="repeat-password" className={styles.RegistrationPage__placeholder}>
            Repeat password
          </label>
          <input
            key="repeat-password"
            id="repeat-password"
            {...passwordField}
            value={repeatPassword}
            onChange={(e) => {
              setRepeatPassword(e.target.value);
            }}
            className={styles.RegistrationPage__formItem}
            type={'password'}
            required={true}
            autoFocus={true}
          />
          {password != repeatPassword && (
            <p
              className={`${styles.RegistrationPage__formTips} ${styles.RegistrationPage__formTips_error}`}
            >
              Passwords arent equal
            </p>
          )}
        </div>
        <button className={styles.RegistrationPage__formButton} type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
}
