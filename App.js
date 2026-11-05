import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// PASTE YOUR REAL firebaseConfig VALUES HERE
const firebaseConfig = {
  apiKey: 'AIzaSyDc9hY-HsshX5vVeX5ZM3pNBKoiy2t05mk',
  authDomain: 'otp-quiz-c4473.firebaseapp.com",',
  projectId: 'otp-quiz-c4473',
  storageBucket: 'otp-quiz-c4473.firebasestorage.app',
  messagingSenderId: '568035490437',
  appId: '1:568035490437:web:d0644b166530d9328ec7ec',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [done, setDone] = useState(false);

  const sendOtp = async () => {
    setLoading(true); setMessage('');
    try {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
      const old = document.getElementById('recaptcha-container');
      if (old) old.remove();
      const div = document.createElement('div');
      div.id = 'recaptcha-container';
      document.body.appendChild(div);

      window.recaptchaVerifier = new RecaptchaVerifier(auth, div, { size: 'invisible' });
      const result = await signInWithPhoneNumber(auth, phone.trim(), window.recaptchaVerifier);
      setConfirmation(result);
      setMessage('OTP sent! Check your SMS.');
      setSuccess(true);
    } catch (e) {
      setMessage('Failed to send OTP: ' + e.message);
      setSuccess(false);
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true); setMessage('');
    try {
      await confirmation.confirm(otp.trim());
      setDone(true);
      setMessage('✅ Verification successful!');
      setSuccess(true);
    } catch (e) {
      setMessage('❌ Verification failed: wrong or expired OTP.');
      setSuccess(false);
    }
    setLoading(false);
  };

  const reset = async () => {
    await auth.signOut().catch(() => {});
    setPhone(''); setOtp(''); setConfirmation(null);
    setDone(false); setMessage(''); setSuccess(null);
  };

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.title}>Phone Verification</Text>

      {!confirmation && !done && (
        <>
          <Text style={s.label}>Phone number (with country code)</Text>
          <TextInput
            style={s.input}
            placeholder="+923001234567"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity style={s.btn} onPress={sendOtp} disabled={loading}>
            <Text style={s.btnText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {confirmation && !done && (
        <>
          <Text style={s.label}>Enter the OTP sent to {phone}</Text>
          <TextInput
            style={s.input}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={s.btn} onPress={verifyOtp} disabled={loading}>
            <Text style={s.btnText}>Verify OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendOtp} disabled={loading}>
            <Text style={s.link}>Resend OTP</Text>
          </TouchableOpacity>
        </>
      )}

      {done && (
        <TouchableOpacity style={s.btn} onPress={reset}>
          <Text style={s.btnText}>Start over</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {!!message && (
        <Text style={[s.msg, { color: success ? 'green' : 'red' }]}>{message}</Text>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff', maxWidth: 500, width: '100%', alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 8, padding: 12, fontSize: 18, marginBottom: 16 },
  btn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 16, fontSize: 16 },
  msg: { marginTop: 20, fontSize: 18, textAlign: 'center' },
});