import React from 'react';
import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import App from '../App';


test('hata olmadan render ediliyor', () => {
    render(<App />);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<App />);
    const headerElement = screen.getByText(/Entegrasyon Test Projesi/i);
    expect(headerElement).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu />);
    const nameValue = screen.getByTestId("nameInput");
    fireEvent.change(nameValue, { target: { value: "asdf" } });
    expect(screen.getByTestId("error-ad")).toHaveTextContent("Hata: ad en az 5 karakter olmalıdır.")

    // const errorMessage = screen.getByText(/kullanıcı adı en az 5 karakter olmalıdır/i);
    // expect(errorMessage).toBeInTheDocument();
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />)

    const submitButton = screen.getByText("Gönder");
    expect(screen.queryAllByTestId("error")).toHaveLength(0);

    fireEvent.click(submitButton);

    const nameInput = screen.getByTestId("nameInput");
    fireEvent.change(nameInput, { target: { value: "" } });
    const adErrorMessage = screen.getByTestId("error-ad");
    expect(adErrorMessage).toBeInTheDocument();

    const lastNameInput = screen.getByTestId("lastNameInput");
    fireEvent.change(lastNameInput, { target: { value: "" } });
    const soyadErrorMessage = screen.getByTestId("error-soyad");
    expect(soyadErrorMessage).toBeInTheDocument();

    const emailInput = screen.getByTestId("emailInput");
    fireEvent.change(emailInput, { target: { value: "" } });
    const mailErrorMessage = screen.getByTestId("error-email");
    expect(mailErrorMessage).toBeInTheDocument();





});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />)

    const nameInput = screen.getByTestId("nameInput");
    fireEvent.change(nameInput, { target: { value: "DoğruAd" } });

    const lastNameInput = screen.getByTestId("lastNameInput");
    fireEvent.change(lastNameInput, { target: { value: "DoğruSoyad" } });

    const submitButton = screen.getByText("Gönder")
    fireEvent.click(submitButton);

    const emailInput = screen.getByTestId("emailInput");
    fireEvent.change(emailInput, { target: { value: "hatalıMail.com" } });

    const emailErrorMessage = screen.getByTestId("error-email");
    expect(emailErrorMessage).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const emailInput = screen.getByTestId("emailInput");
    fireEvent.change(emailInput, { target: { value: "hata.com" } });
    const submitButton = screen.getByText("Gönder");
    fireEvent.click(submitButton);
    expect(screen.getByTestId("error-email")).toHaveTextContent(/email geçerli bir email adresi olmalıdır./i);
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu />);
    const lastNameInput = screen.getByTestId("lastNameInput");
    fireEvent.change(lastNameInput, { target: { value: "" } });

    const submitButton = screen.getByText("Gönder");
    fireEvent.click(submitButton);
    const errorMessage = screen.getByTestId("error-soyad");
    expect(errorMessage).toHaveTextContent(/soyad gereklidir/i);

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    render(<IletisimFormu />)

    const submitButton = screen.getByText("Gönder");

    fireEvent.click(submitButton);

    const nameInput = screen.getByTestId("nameInput");
    fireEvent.change(nameInput, { target: { value: "" } });
    const adErrorMessage = screen.getByTestId("error-ad");
    expect(adErrorMessage).toBeInTheDocument();

    const lastNameInput = screen.getByTestId("lastNameInput");
    fireEvent.change(lastNameInput, { target: { value: "" } });
    const soyadErrorMessage = screen.getByTestId("error-soyad");
    expect(soyadErrorMessage).toBeInTheDocument();

    const emailInput = screen.getByTestId("emailInput");
    fireEvent.change(emailInput, { target: { value: "" } });
    const mailErrorMessage = screen.getByTestId("error-email");
    expect(mailErrorMessage).toBeInTheDocument();

    const messageInput = screen.getByTestId("messageInput");
    fireEvent.change(messageInput, { target: { value: "" } });
    const errorMessage = screen.queryByTestId("error-message");
    expect(errorMessage).not.toBeInTheDocument();

});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu />)

    const nameInput = screen.getByTestId("nameInput");
    fireEvent.change(nameInput, { target: { value: "Randomname" } });

    const lastNameInput = screen.getByTestId("lastNameInput");
    fireEvent.change(lastNameInput, { target: { value: "lastName" } });

    const emailInput = screen.getByTestId("emailInput");
    fireEvent.change(emailInput, { target: { value: "randomNames@example.com" } });

    const messageInput = screen.queryByTestId("messageInput");
    fireEvent.change(messageInput, { target: { value: "Example message" } });

    const submitButton = screen.getByText("Gönder");
    fireEvent.click(submitButton);

    const adErrorMessage = screen.queryByTestId("error-ad");
    expect(adErrorMessage).not.toBeInTheDocument();
    const soyadErrorMessage = screen.queryByTestId("error-soyad");
    expect(soyadErrorMessage).not.toBeInTheDocument();
    const mailErrorMessage = screen.queryByTestId("error-email");
    expect(mailErrorMessage).not.toBeInTheDocument();
    const errorMessage = screen.queryByTestId("error-message");
    expect(errorMessage).not.toBeInTheDocument();

});
