import { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm'

export default function NewMeetupPage() {
  const router = useRouter();

  async function addMeetupHandler(enterdMettupData) {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(enterdMettupData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    console.log(data);

    router.push('/');
  }
  
  return <NewMeetupForm onAddMeetup={addMeetupHandler}/>
}