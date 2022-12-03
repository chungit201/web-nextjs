import NoteForm from "../../../../common/components/note-components/note-form";
import {AppLayout} from "../../../../common/layouts/app-layout";

const EditNote = (props) => {
  return (
    <AppLayout>
      <NoteForm mode='edit' note={props.note}/>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const auth = require("server/utils/auth");
  const {noteService} = require("server/services");
  const {noteId} = context.query
  let note = {};
  try {
    await auth(context, []);
    note = await noteService.getNote({_id: noteId});
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      note: JSON.parse(JSON.stringify(note)),
    }
  }
}

export default EditNote