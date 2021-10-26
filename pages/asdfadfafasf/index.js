import { Fragment } from "react";
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import { useRouter } from "next/router";

export default function MeetupDetails(props) {
  const router = useRouter();
  const { meetupId } = router.query;

  return (
    <>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
        image1={props.meetupData.image1}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  return {
    fallback: true,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };

  // return {
  //   fallback: false,
  //   paths: [
  //     {
  //       params: {
  //         meetupId: 'm1',
  //       }
  //     },
  //     {
  //       params: {
  //         meetupId: 'm2',
  //       }
  //     }
  //   ]
  // }
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  //const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
        image1: selectedMeetup.image1,
      },
    },
    revalidate: 1,
  };

  // return {
  //   props: {
  //     meetupData: {
  //       id: 1,
  //       title: '1',
  //       address: '1',
  //       image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
  //       description: '1'
  //     }
  //   },
  //   revalidate: 1
  // };
}
