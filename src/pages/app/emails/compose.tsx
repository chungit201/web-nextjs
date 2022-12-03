import React from "react";
import MailboxLayout from "common/layouts/mailbox-layout";
import AppLayout from "common/layouts/app-layout"
import MailCompose from "common/components/email-components/MailCompose";

const Emails = () => {
  return (
    <MailCompose/>
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
