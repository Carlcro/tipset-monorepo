// TODO this file

import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Container from "../../../components/Container";

export default function Join() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex justify-center">
      <Container classNames="px-12 py-5 flex flex-col">
        <span>Du skickas snart till din grupp...</span>
        <Link href={`/user-tournament-page/${id}`}>
          <a className="mt-6 text-blue-700">Klicka här om du inte blir det</a>
        </Link>
      </Container>
    </div>
  );
}
