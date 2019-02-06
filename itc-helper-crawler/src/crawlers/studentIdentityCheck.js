import User from 'models/User';

const IdentityCheckException = (message) => {
  this.message = message;
  this.name = 'IdentityCheckException';
};

const studentIdentityCheck = async ({ page, data }) => {
  let dialogMsg = null;
  await page.on('dialog', async (dialog) => {
    dialogMsg = dialog.message();
    await dialog.dismiss();
  });
  await page.goto('http://attend.inhatc.ac.kr/', {
    waitUntil: 'domcontentloaded',
  });
  await page.type('#i_username', data.userStudentId);
  await page.type('#i_password', data.userStudentPw);
  await Promise.all([
    page.click('.login_btn button'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  try {
    if (
      page.url() !== 'http://attend.inhatc.ac.kr/student/student_mypage'
      || dialogMsg
    ) {
      throw new Error('Login Failed');
    }
    await page.goto(
      'http://attend.inhatc.ac.kr/student/info/student_view_edit',
      {
        waitUntil: 'domcontentloaded',
      },
    );

    const name = await page.$eval(
      '.info_area tr:nth-child(4) td',
      el => el.innerText,
    );
    const department = await page.$eval(
      '.info_area tr:nth-child(3) td',
      el => el.innerText,
    );
    const [status, grade] = await page.$eval(
      '.info_area tr:nth-child(7) td',
      el => el.innerText.split('/'),
    );
    await User.update(
      { id: data.userId },
      {
        name,
        department,
        status,
        grade: grade.split('학년')[0],
        studentValidate: true,
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export default studentIdentityCheck;
