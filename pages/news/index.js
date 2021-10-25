import { Fragment } from 'react';
import Link from 'next/link';

export default function NewsPage() {
  return <Fragment>
      <h1>The New Page</h1>
      <ul>
        <li><Link href="/news/something-important">1</Link></li>
        <li><a href="">2</a></li>
      </ul>
    </Fragment>
}