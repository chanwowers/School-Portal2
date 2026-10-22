/* ------------------------------------------------------------------
   courses.js — course list for Courses.html.

   The subject list below is demo data, but the assessments are left
   EMPTY on purpose: teachers will add assessments from the Teacher
   Portal once that side is connected. This page already knows how to
   render assessments (type, status, due date and score), so once real
   records are available they will appear without changing the layout.
   ------------------------------------------------------------------ */

const COURSES = [
  {
    code: 'AP',
    name: 'Araling Panlipunan',
    teacher: 'Mrs. R. Delos Santos',
    room: 'Room 201',
    schedule: 'Mon · Wed · Fri, 8:00 – 9:00 AM',
    assessments: []
  },
  {
    code: 'SCI',
    name: 'Science',
    teacher: 'Mr. A. Villanueva',
    room: 'Science Lab 2',
    schedule: 'Mon · Tue · Thu, 9:00 – 10:00 AM',
    assessments: []
  },
  {
    code: 'ENG',
    name: 'English',
    teacher: 'Ms. K. Ramos',
    room: 'Room 305',
    schedule: 'Mon – Fri, 10:00 – 11:00 AM',
    assessments: []
  },
  {
    code: 'FIL',
    name: 'Filipino',
    teacher: 'Gng. L. Mercado',
    room: 'Room 305',
    schedule: 'Mon · Wed · Fri, 11:00 AM – 12:00 PM',
    assessments: []
  },
  {
    code: 'ESP',
    name: 'Edukasyon sa Pagpapakatao',
    teacher: 'Mr. J. Aquino',
    room: 'Room 201',
    schedule: 'Tue · Thu, 1:00 – 2:00 PM',
    assessments: []
  },
  {
    code: 'MATH',
    name: 'Mathematics',
    teacher: 'Ms. C. Bautista',
    room: 'Room 204',
    schedule: 'Mon – Fri, 2:00 – 3:00 PM',
    assessments: []
  },
  {
    code: 'MAPEH',
    name: 'MAPEH',
    teacher: 'Mr. D. Santos',
    room: 'Gymnasium',
    schedule: 'Mon · Wed, 3:00 – 4:00 PM',
    assessments: []
  },
  {
    code: 'TLE',
    name: 'TLE',
    teacher: 'Mrs. P. Reyes',
    room: 'TLE Laboratory',
    schedule: 'Tue · Thu, 3:00 – 4:00 PM',
    assessments: []
  }
];

const TYPE_LABELS = {
  quiz: 'Quiz',
  assignment: 'Assignment',
  project: 'Project',
  performance: 'Performance Task',
  exam: 'Exam'
};

const STATUS_LABELS = {
  pending: 'To do',
  submitted: 'Submitted',
  graded: 'Graded'
};

const TONES = ['', 'sage', 'gold', 'plum'];

const courseList = document.getElementById('courseList');

if (courseList) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filter = 'all';

  function dateAt(offset) {
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
  }

  function shortDate(date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function dateText(assessment) {
    if (assessment.status === 'pending') {
      if (assessment.offset === 0) return 'Due today';
      if (assessment.offset === 1) return 'Due tomorrow';
      return 'Due ' + shortDate(dateAt(assessment.offset));
    }

    const done = assessment.done == null ? assessment.offset : assessment.done;
    return shortDate(dateAt(done));
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function assessmentEl(assessment) {
    const item = el('article', 'assess');
    const body = el('div', 'assess-main');

    const top = el('div', 'assess-top');
    top.append(el('span', 'assess-type type-' + assessment.kind, TYPE_LABELS[assessment.kind]));
    top.append(el('h3', 'assess-title', assessment.title));

    body.append(top);
    body.append(el('p', 'assess-desc', assessment.description));

    const side = el('div', 'assess-side');
    side.append(el('span', 'assess-status ' + assessment.status, STATUS_LABELS[assessment.status]));
    side.append(el('span', 'assess-date', dateText(assessment)));

    if (assessment.status === 'graded' && assessment.score != null) {
      const score = el('span', 'assess-score');
      score.append(document.createTextNode(String(assessment.score)));
      score.append(el('span', 'assess-points', ' / ' + (assessment.points || 100)));
      side.append(score);
    }

    item.append(body, side);
    return item;
  }

  function courseCard(course, index) {
    const visible = course.assessments.filter(
      a => filter === 'all' || a.status === filter
    );

    const card = el('article', 'course-card' + (visible.length === 0 ? ' is-empty' : ''));
    const head = el('header', 'course-head');

    const tone = TONES[index % TONES.length];
    const mark = el('span', 'course-mark' + (tone ? ' tone-' + tone : ''), course.code);

    const title = el('div', 'course-title');
    title.append(el('h2', '', course.name));
    title.append(el('p', 'course-teacher', course.teacher));

    const meta = el('p', 'course-meta');
    meta.append(el('span', '', course.schedule));
    meta.append(el('span', '', course.room));
    title.append(meta);

    let countText;
    if (course.assessments.length === 0) {
      countText = 'No assessments yet';
    } else if (visible.length === course.assessments.length) {
      countText = visible.length + (visible.length === 1 ? ' assessment' : ' assessments');
    } else {
      countText = visible.length + ' of ' + course.assessments.length + ' assessments';
    }

    head.append(mark, title, el('span', 'course-count', countText));
    card.append(head);

    if (visible.length > 0) {
      const list = el('div', 'assess-list');
      visible.forEach(a => list.append(assessmentEl(a)));
      card.append(list);
    }

    return card;
  }

  function render() {
    courseList.innerHTML = '';

    let shown = 0;

    COURSES.forEach((course, index) => {
      if (filter !== 'all' && !course.assessments.some(a => a.status === filter)) return;
      courseList.append(courseCard(course, index));
      shown += course.assessments.filter(a => filter === 'all' || a.status === filter).length;
    });

    if (shown === 0 && COURSES.some(course => course.assessments.length > 0)) {
      courseList.append(el('p', 'course-empty', 'No assessments match this filter.'));
    }

    if (courseStatus) {
      const noun = 'assessment' + (shown === 1 ? '' : 's');

      if (shown === 0) {
        courseStatus.textContent = 'No assessments posted yet.';
      } else if (filter === 'all') {
        courseStatus.textContent = 'Showing all ' + shown + ' assessments across '
          + COURSES.length + ' subjects.';
      } else if (filter === 'pending') {
        courseStatus.textContent = 'Showing ' + shown + ' ' + noun + ' to do.';
      } else {
        courseStatus.textContent = 'Showing ' + shown + ' ' + filter + ' ' + noun + '.';
      }
    }
  }

  // headline figures
  const all = COURSES.reduce((sum, course) => sum.concat(course.assessments), []);
  const dueThisWeek = all.filter(
    a => a.status === 'pending' && a.offset >= 0 && a.offset <= 7
  ).length;
  const completed = all.filter(a => a.status !== 'pending').length;

  const statSubjects = document.getElementById('statSubjects');
  const statAssessments = document.getElementById('statAssessments');
  const statDue = document.getElementById('statDue');
  const statCompleted = document.getElementById('statCompleted');
  const courseStatus = document.getElementById('courseStatus');
  const courseToolbar = document.getElementById('courseToolbar');
  const courseNote = document.getElementById('courseNote');

  if (statSubjects) statSubjects.textContent = String(COURSES.length);
  if (statAssessments) statAssessments.textContent = String(all.length);
  if (statDue) statDue.textContent = String(dueThisWeek);
  if (statCompleted) statCompleted.textContent = String(completed);

  // nothing to filter or explain until teachers post assessments
  if (courseToolbar) courseToolbar.hidden = all.length === 0;
  if (courseNote) courseNote.hidden = all.length > 0;

  // filters
  const filterButtons = Array.from(document.querySelectorAll('.filter'));

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;

      filterButtons.forEach(other => {
        const active = other === button;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });

      render();
    });
  });

  render();
}
