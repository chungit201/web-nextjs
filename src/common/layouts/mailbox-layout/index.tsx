import React from "react";
import InnerAppLayout from 'common/layouts/inner-app-layout';
import MailMenu from 'common/components/email-components/MailMenu';

const MailboxLayout = (props) => {
  return (
    <div className="mail">
      <InnerAppLayout
        sideContent={<MailMenu {...props}/>}
        mainContent={props.children}
        border
      />
    </div>
  )
};

export default MailboxLayout;
