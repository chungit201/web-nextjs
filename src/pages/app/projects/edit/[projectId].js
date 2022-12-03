import {useState} from "react";
import {useRouter} from "next/router";
import {AppLayout} from "../../../../common/layouts/app-layout";
import {PageHeaderAlt} from "../../../../common/components/layout-components/PageHeaderAlt";
import Flex from "../../../../common/components/shared-components/Flex";
import EditForm from "../../../../common/components/project-components/edit-form";

const defaultProjectOptions = {
  department: "development"
};

const EditProject = () => {
  const router = useRouter();
  const [project, setProject] = useState(defaultProjectOptions);
  const [mode, setMode] = useState(router.query ? "EDIT" : "ADD");
  const id = router.query;

  return (
    <AppLayout>
      <PageHeaderAlt className="border-bottom">
        <div className="container">
          <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
            <h2 className="mb-3">
               Edit Project
            </h2>
          </Flex>
        </div>
      </PageHeaderAlt>
      <EditForm setProject={setProject} project={project} mode="EDIT" projectId={id} />
    </AppLayout>
  )
}

export default EditProject