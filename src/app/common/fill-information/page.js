'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react';

function FillInformation() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://bodyworkandpaint.pantook.com/api/update-user-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        google_id: session.accessToken,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email: session.user.email,
        username: session.user.name,
        profile_image: session.user.image,
      }),
    });

    const data = await response.json();

    if (data.status === 'success') {
      router.push('/common/findcar');
    } else {
      alert('Error updating user information');
    }
  };

  return (
    <div>
      <h1>Fill Information</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default FillInformation;
