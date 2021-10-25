import { useRouter } from 'next/router';

export default function DetailPage() {
  const router = useRouter();

  const newsId = router.query.newsId; 

  //send to server to get data
  
  return (
     '<h1>The Detail Page</h1>'
  )
}
