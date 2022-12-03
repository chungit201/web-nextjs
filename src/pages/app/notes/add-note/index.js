import {AppLayout} from "../../../../common/layouts/app-layout";
import NoteForm from "../../../../common/components/note-components/note-form";

const AddNote = (props) => {
  return (
    <AppLayout>
      <div>
        <NoteForm mode="add"/>
      </div>
    </AppLayout>
  )
}

export default AddNote