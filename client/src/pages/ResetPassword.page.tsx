import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ResetPasswordPage() {
  const [tempCode, setTempCode] = useState('');
  const [display, setDisplay] = useState<'tempCode' | 'password'>('tempCode');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  if (email == null) {
    console.log("No email retrieved")
    return
  }

  const handleCodeSubmit = async () => {
    console.log("Email (handleCodeSubmit): ", email)

    const response = await fetch('http://localhost:5000/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, tempCode }),
    });
    
    if (response.ok) {
        console.log("Correct code")
        setDisplay('password');
    } else {
        console.log("Invalid code");
    }
  }

  const handlePasswordSubmit = async () => {
    const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
    });
    
    if (response.ok) {
        console.log("You successfully reset your password")
        navigate('/login');
    }
  }


  return (
    <div>
    {display === 'tempCode' ? (
      <form onSubmit={handleCodeSubmit}>
          <input type="hidden" value={email} name="email" />
          <input type="tempCode" placeholder="Enter Code" required />
          <button type="submit">Submit</button>
      </form>
    ) : (
      <form onSubmit={handlePasswordSubmit}>
          <input type="password" placeholder="New Password" required />
          <button type="submit">Change Password</button>
      </form>
    )}
    </div>
  );
}
