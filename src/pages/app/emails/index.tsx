import React, {useEffect, useState} from "react";
import MailboxLayout from "common/layouts/mailbox-layout";
import AppLayout from "common/layouts/app-layout"
import ApiService from "common/services/ApiService";
import MailItem from "common/components/email-components/MailItem";

const Emails = () => {
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    ApiService.getEmails().then(response => {
      setEmails(response.data.emails)
    });
  }, [])
  return (
    <MailItem emails={emails}/>
  )
};

Emails.getLayout = (page) => {
  return (
    <AppLayout>
      <MailboxLayout>
        {page}
      </MailboxLayout>
    </AppLayout>
  )
}

export default Emails;
