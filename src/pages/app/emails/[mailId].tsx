import React, {useEffect, useState} from "react";
import AppLayout from "common/layouts/app-layout"
import MailboxLayout from "common/layouts/mailbox-layout";
import {useRouter} from "next/router";
import ApiService from "common/services/ApiService";
import MailDetail from "common/components/email-components/MailDetail";

const Mail = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState({});
  const router = useRouter();
  const id = router.query.mailId;
  useEffect(() => {
    if (id) ApiService.getEmail(id).then((response) => {
      setEmail(response.data);
      setLoading(false);
    })
  }, [id]);
  return (
    <>
      {!loading && (
        <MailDetail email={email}/>
      )}
    </>
  )
};

Mail.getLayout = (page) => {
  return (
    <AppLayout>
      <MailboxLayout>
        {page}
      </MailboxLayout>
    </AppLayout>
  )
}

export default Mail;
