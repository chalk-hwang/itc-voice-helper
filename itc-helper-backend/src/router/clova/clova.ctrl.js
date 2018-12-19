import { CEKResponse, audioDirective } from 'lib/clova';
import * as DeptStore from 'models/Dept';
import * as SubDeptStore from 'models/SubDept';
import * as Prof from 'models/Prof';

export const launchRequest = () => {
  const resp = new CEKResponse();

  resp
    .setSimpleSpeechText(
      '안녕하세요. 인하공전 도우미입니다. 무엇을 도와드릴까요? 제가 할 수 있는 능력이 궁금하시다면 "가이드 알려줘"라고 말해보세요.',
    )
    .setMultiturn();

  return resp;
};

export const itcIntroduce = () => {
  const resp = new CEKResponse();

  resp
    .setSimpleSpeechText(
      '인하공업전문대학은 대한민국의 전문대학이다. 학교 내에 대한민국 수준원점[등록문화재 제247호]이 있다.',
    )
    .setMultiturn();

  return resp;
};

export const itcWhere = () => {
  const resp = new CEKResponse();

  resp
    .setSimpleSpeechText(
      '인하공전은 인천광역시 미추홀구 인하로100에 위치해 있다.',
    )
    .setMultiturn();

  return resp;
};

export const itcSong = () => {
  const resp = new CEKResponse();
  resp
    .appendSpeechText('교가를 재생합니다.')
    .addDirective(
      audioDirective(
        'https://s3.ap-northeast-2.amazonaws.com/itc-helper/collegesong.mp3',
      ),
    );
  return resp;
};

export const itcDept = (request, session) => {
  const { slots } = request.intent;
  const { sessionAttributes: sessSlots } = session;
  const resp = new CEKResponse();

  if ((slots && slots.ITC_DEPT) || (sessSlots && sessSlots.ITC_DEPT)) {
    const ITC_DEPT = slots && slots.ITC_DEPT ? slots.ITC_DEPT : sessSlots.ITC_DEPT;
    const dept = DeptStore.get(ITC_DEPT.value);
    resp
      .appendSpeechText(dept.desc)
      .appendSpeechText(
        '해당 학부에 무슨 과가 있는지 궁금하시다면, 무슨 과가 있어? 라고 말해보세요.',
      )
      .setMultiturn({
        ITC_DEPT,
      });
    return resp;
  }

  const deptAllNames = DeptStore.getAllNames();
  resp
    .appendSpeechText(
      `인하공전에 있는 학부는 ${deptAllNames.join(', ')}가 있습니다.`,
    )
    .appendSpeechText(
      `학부에 대해 자세히 알고 싶으시면 예를 들어, ${
        deptAllNames[0]
      }에 대해 알려줘 또는 ${
        deptAllNames[0]
      }에 무슨 과가 있는지 알려줘. 라고 말해보세요`,
    )
    .setMultiturn();
  return resp;
};

export const itcSubDeptInDept = (request, session) => {
  const { slots } = request.intent;
  const { sessionAttributes: sessSlots } = session;
  const resp = new CEKResponse();

  if ((slots && slots.ITC_DEPT) || (sessSlots && sessSlots.ITC_DEPT)) {
    const ITC_DEPT = slots && slots.ITC_DEPT ? slots.ITC_DEPT : sessSlots.ITC_DEPT;
    const dept = DeptStore.get(ITC_DEPT.value);
    resp
      .appendSpeechText(`${dept.name}에는 ${dept.subs.join(', ')}가 있습니다.`)
      .appendSpeechText(
        `해당 학부에 대해 궁금하시다면, 해당 학부에 대해 자세히 알려줘, 과에 대해 자세히 알고 싶으시면 예를 들어, ${
          dept.subs[0]
        }에 대해 알려줘. 라고 말해보세요.`,
      )
      .setMultiturn({
        ITC_DEPT,
      });
  } else {
    resp
      .appendSpeechText(
        '과가 너무 많아서 알려드리기가 힘들어요. 일단은 무슨 학부가 있는지 부터 알아보는게 어때요? 무슨 학부가 있는지 알려줘 로 말해보세요. 아니면 컴퓨터시스템과에 대해 알려줘. 라고 말해보세요.',
      )
      .setMultiturn();
  }

  return resp;
};

export const itcSubDept = (request) => {
  const { slots } = request.intent;
  const resp = new CEKResponse();

  if (slots && slots.ITC_SUB_DEPT) {
    const subDept = SubDeptStore.get(slots.ITC_SUB_DEPT.value);
    if (subDept) {
      resp
        .appendSpeechText(
          `${
            subDept.desc
          } 해당 과의 교수진이 궁금하시면 교수진 알려줘 라고 말해보세요.`,
        )
        .setMultiturn({
          ITC_SUB_DEPT: slots.ITC_SUB_DEPT,
        });
    } else {
      resp
        .appendSpeechText(
          `${
            slots.ITC_SUB_DEPT.value
          }는 아직 공부하지 못했어요. 좀 더 공부해서 알려드릴께요.`,
        )
        .setMultiturn();
    }
    return resp;
  }
  resp
    .appendSpeechText('음... 잘 이해하지 못했어요. 다시 한번 말해주시겠어요?')
    .setMultiturn();
  return resp;
};

export const itcProfInSubDept = (request, session) => {
  const { slots } = request.intent;
  const { sessionAttributes: sessSlots } = session;
  const resp = new CEKResponse();

  if ((slots && slots.ITC_SUB_DEPT) || (sessSlots && sessSlots.ITC_SUB_DEPT)) {
    const ITC_SUB_DEPT = slots && slots.ITC_SUB_DEPT ? slots.ITC_SUB_DEPT : sessSlots.ITC_SUB_DEPT;

    const subDept = SubDeptStore.get(ITC_SUB_DEPT.value);
    if (subDept) {
      resp.appendSpeechText(
        `${subDept.name}과의 교수진은 ${subDept.profs.join(
          ' 교수, ',
        )} 교수입니다. 교수님에 대해 자세히 알고 싶으시면 예를 들어, ${
          subDept.profs[0]
        } 교수에 대해 알려줘. 또는 ${
          subDept.profs[0]
        } 교수의 연구실위치 알려줘. 라고 말해보세요.`,
      );
    } else {
      resp.appendSpeechText(
        `${
          slots.ITC_SUB_DEPT.value
        }는 아직 공부하지 못했어요. 좀 더 공부해서 알려드릴께요.`,
      );
    }
    return resp.setMultiturn();
  }

  resp
    .appendSpeechText(
      '어느 과의 교수진이 궁금하세요? 예를 들어, 컴퓨터시스템과 교수진 알려줘. 라고 말해보세요.',
    )
    .setMultiturn();
  return resp;
};

export const itcProf = (request, session) => {
  const { slots } = request.intent;
  const { sessionAttributes: sessSlots } = session;
  const resp = new CEKResponse();
  let ITC_PROF = null;
  let ITC_PROF_DETAIL = null;
  let prof = null;

  if ((slots && slots.ITC_PROF) || (sessSlots && sessSlots.ITC_PROF)) {
    ITC_PROF = slots && slots.ITC_PROF ? slots.ITC_PROF : sessSlots.ITC_PROF;
  }
  if (
    (slots && slots.ITC_PROF_DETAIL)
    || (sessSlots && sessSlots.ITC_PROF_DETAIL)
  ) {
    ITC_PROF_DETAIL = slots && slots.ITC_PROF_DETAIL
      ? slots.ITC_PROF_DETAIL
      : sessSlots.ITC_PROF_DETAIL;
  }
  if (ITC_PROF) {
    prof = Prof.get(ITC_PROF.value);
    if (!prof) {
      resp
        .appendSpeechText(
          `${
            slots.ITC_PROF.value
          }는 아직 공부하지 못했어요. 좀 더 공부해서 알려드릴께요.`,
        )
        .setMultiturn();
      return resp;
    }
  }
  if (ITC_PROF && ITC_PROF_DETAIL) {
    resp
      .appendSpeechText(
        `${prof.name} 교수의 ${ITC_PROF_DETAIL.value}는 ${
          prof[ITC_PROF_DETAIL.value]
        }입니다. 다른 듣고 싶으신 정보가 있으시면, 연구실 위치 알려줘, 연락처 알려줘, 담당과목 알려줘. 라고 말해보세요.`,
      )
      .setMultiturn({
        ITC_PROF,
      });
  } else if (ITC_PROF) {
    resp
      .appendSpeechText(
        `${prof.name}교수의 연구실 위치는 ${prof.연구실위치}, 연락처는 ${
          prof.연락처
        }, 담당과목은 ${prof.담당과목}입니다.`,
      )
      .setMultiturn();
  } else if (ITC_PROF_DETAIL) {
    resp
      .appendSpeechText(
        `어느 교수님의 ${
          ITC_PROF_DETAIL.value
        }가 궁금하세요? 예를 들어, 김철진 교수님에 대해 알려줘 라고 말하면 됩니다.`,
      )
      .setMultiturn({
        ITC_PROF_DETAIL,
      });
  } else {
    resp
      .appendSpeechText('음... 잘 이해하지 못했어요. 다시 한번 말해주시겠어요?')
      .setMultiturn();
  }
  return resp;
};

export const sessionEndedRequest = async () => {
  const resp = new CEKResponse();

  return resp.clearMultiturn();
};

export const notFound = async (request, session) => {
  const resp = new CEKResponse();

  resp
    .setSimpleSpeechText(
      '음... 잘 이해하지 못했어요. 다시 한번 말해주시겠어요? 혹시, 가이드가 필요하시다면 가이드 알려줘 말해보세요.',
    )
    .setMultiturn(session.sessionAttributes);

  return resp;
};
