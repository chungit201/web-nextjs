import {AppLayout} from "../../../../common/layouts/app-layout";
import EditForm from "../../../../common/components/project-components/edit-form";
import {PageHeaderAlt} from "../../../../common/components/layout-components/PageHeaderAlt";
import Flex from "../../../../common/components/shared-components/Flex";
import {useState} from "react";
import {useRouter} from "next/router";

const defaultProjectOptions = {
  department: "development"
};

const AddProject = () => {
  const router = useRouter();
  const [project, setProject] = useState(defaultProjectOptions);
  const id =1

  return (
    <AppLayout>
      <PageHeaderAlt className="border-bottom">
        <div className="container">
          <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
            <h2 className="mb-3">
              Add new Project
            </h2>
          </Flex>
        </div>
      </PageHeaderAlt>
      <EditForm setProject={setProject} project={project} mode="ADD" projectId={id} />
    </AppLayout>
  )
}

export default AddProject