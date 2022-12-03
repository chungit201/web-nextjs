const {Issue, GitLabRecord, User, Project} = require("../models");
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");
const {projectActivityService} = require('../services');

const gitlabHook = async (req, res) => {
  const eventBody = req.body;
  let objectKind = eventBody['object_kind'];
  let eventType = eventBody['event_name'] || eventBody['event_type'];
  let gitlabUserId = eventBody['user'] ? eventBody['user']['id'] : eventBody['user_id'];
  let projectId = eventBody['project'] ? eventBody['project']['id'] : eventBody['project_id'];
  let timestamp = new Date().getTime();
  const user = await User.findOne({
    gitlabId: gitlabUserId
  });

  const {_id: project} = await Project.findOne({"autoDeploy.gitlabId": projectId}).lean();
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, `Project with GitLab id not found`)
  }

  const record = await GitLabRecord.create({
    type: objectKind,
    projectId: projectId,
    gitlabUserId: gitlabUserId,
    userId: user ? user._id : null,
    data: eventBody
  });
  let content = "";
  switch (objectKind) {
    case "issue":
      // handle issue
      const issueDetail = eventBody['object_attributes'];
      const issueId = issueDetail['id'];
      // TODO: save issue / update issue
      const currentIssue = await Issue.findOne({
        id: issueId
      });
      const mappedIssueObject = {
        project: project,
        id: issueDetail['id'],
        index: issueDetail['iid'],
        // gitLabAuthorId: issueDetail['author_id'],
        gitLabAuthor: eventBody['user'],
        createdAt: new Date(issueDetail['created_at']).getTime(),
        closedAt: issueDetail['closed_at'] ? new Date(issueDetail['closed_at']).getTime() : null,
        confidential: issueDetail['confidential'],
        description: issueDetail['description'],
        discussionLocked: issueDetail['discussion_locked'],
        dueDate: issueDetail['due_date'] ? new Date(issueDetail['due_date']).getTime() : null,
        lastEditedAt: issueDetail['last_edited_at'] ? new Date(issueDetail['last_edited_at']).getTime() : this.createdAt,
        lastEditedByGitlabId: issueDetail['last_edited_by_id'],
        milestoneId: issueDetail['milestone_id'],
        movedToId: issueDetail['moved_to_id'],
        duplicatedToId: issueDetail['duplicated_to_id'],
        projectId: issueDetail['project_id'],
        relativePosition: issueDetail['relative_position'],
        stateId: issueDetail['state_id'],
        timeEstimate: issueDetail['time_estimate'],
        title: issueDetail['title'],
        updatedAt: issueDetail['updated_at'] ? new Date(issueDetail['updated_at']).getTime() : null,
        updatedByGitlabId: issueDetail['updated_by_id'],
        weight: issueDetail['weight'],
        url: issueDetail['url'],
        totalTimeSpent: issueDetail['total_time_spent'],
        timeChange: issueDetail['time_change'],
        humanTotalTimeSpent: issueDetail['human_total_time_spent'],
        humanTimeChange: issueDetail['human_time_change'],
        humanTimeEstimate: issueDetail['human_time_estimate'],
        assignees: eventBody['assignees'],
        labels: /*issueDetail['labels']*/req.body.labels,
        state: issueDetail['state'],
        severity: issueDetail['severity'],
      };
      if (!currentIssue) {
        Issue.create(mappedIssueObject).then(r => {
          res.json({
            success: "true"
          });
        });
      } else {
        Issue.updateOne({
          id: issueId
        }, mappedIssueObject).then(r => {
          res.json({
            updated: "true"
          });
        });
      }
      // content = `An issue with title "${mappedIssueObject.title}" was created by ${(user) ? user.fullName : eventBody.user.name} [id: ${gitlabUserId}]`
      break;
  }

  await projectActivityService.createProjectActivity({
    type: "gitlabRecord",
    // content,
    project,
    gitlabRecord: record
  });

};

module.exports = {
  gitlabHook,
}
