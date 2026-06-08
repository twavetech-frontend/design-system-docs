'use client';
// All Table docs demos live here as client components. Column `render` callbacks
// are functions, which cannot be passed from server-rendered MDX to the client
// <Table> component — so the columns/data and the <Table> usage are kept inside
// this 'use client' boundary and MDX just renders these demo components.
import { Table, StatusBadge, UserCell, Badges, RowActions } from './Table';

const teamColumns = [
  { key: 'user', header: '이름', sort: 'desc', render: (row) => <UserCell src={row.avatar} name={row.name} email={row.email} /> },
  { key: 'status', header: '상태', render: (row) => <StatusBadge variant={row.statusVariant}>{row.status}</StatusBadge> },
  { key: 'role', header: '역할' },
  { key: 'team', header: '팀' },
];

const teamData = [
  { id: 1, name: '김민준', email: 'kim@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=1', status: '활성', statusVariant: 'success', role: '관리자', team: '디자인' },
  { id: 2, name: '이서연', email: 'lee@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=2', status: '활성', statusVariant: 'success', role: '편집자', team: '프로덕트' },
  { id: 3, name: '박지호', email: 'park@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=3', status: '대기', statusVariant: 'warning', role: '뷰어', team: '엔지니어링' },
  { id: 4, name: '최예린', email: 'choi@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=4', status: '비활성', statusVariant: 'gray', role: '뷰어', team: '마케팅' },
  { id: 5, name: '정도윤', email: 'jung@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=5', status: '활성', statusVariant: 'success', role: '편집자', team: '디자인' },
];

const fileColumns = [
  { key: 'name', header: '파일명' },
  { key: 'size', header: '크기', align: 'right' },
  { key: 'status', header: '상태', render: (row) => <StatusBadge variant={row.statusVariant}>{row.status}</StatusBadge> },
  { key: 'uploaded', header: '업로드일', align: 'right' },
];

const fileData = [
  { id: 1, name: '제품 사양서.pdf', size: '1.2 MB', status: '게시됨', statusVariant: 'success', uploaded: '2026-04-25' },
  { id: 2, name: '디자인 가이드.fig', size: '3.4 MB', status: '검토중', statusVariant: 'warning', uploaded: '2026-04-22' },
  { id: 3, name: 'Q1 보고서.xlsx', size: '820 KB', status: '게시됨', statusVariant: 'success', uploaded: '2026-04-15' },
];

const teamMembers = [
  { id: 1, name: '김민준', handle: '@minjun', email: 'kim@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=11', role: '프로덕트 디자이너', teams: ['디자인', '프로덕트', '마케팅', '리서치', '그로스'] },
  { id: 2, name: '이서연', handle: '@seoyeon', email: 'lee@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=12', role: '프로덕트 매니저', teams: ['프로덕트', '디자인', '마케팅', '세일즈'] },
  { id: 3, name: '박지호', handle: '@jiho', email: 'park@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=13', role: '프론트엔드 개발자', teams: ['엔지니어링', '프로덕트', '디자인'] },
  { id: 4, name: '최예린', handle: '@yerin', email: 'choi@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=14', role: '백엔드 개발자', teams: ['엔지니어링', '플랫폼', '인프라', '보안'] },
  { id: 5, name: '정도윤', handle: '@doyun', email: 'jung@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=15', role: 'UX 디자이너', teams: ['디자인', '리서치', '프로덕트'] },
  { id: 6, name: '강하은', handle: '@haeun', email: 'kang@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=16', role: 'UX 라이터', teams: ['디자인', '마케팅'] },
  { id: 7, name: '윤서준', handle: '@seojun', email: 'yoon@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=17', role: 'UI 디자이너', teams: ['디자인', '프로덕트', '브랜드', '그로스'] },
  { id: 8, name: '임채원', handle: '@chaewon', email: 'lim@iminapp.kr', avatar: 'https://i.pravatar.cc/64?img=18', role: 'QA 엔지니어', teams: ['엔지니어링', 'QA'] },
];

const memberColumns = [
  { key: 'user', header: '이름', sort: 'desc', render: (r) => <UserCell src={r.avatar} name={r.name} email={r.handle} /> },
  { key: 'status', header: '상태', render: () => <StatusBadge variant="success">활성</StatusBadge> },
  { key: 'role', header: '역할', help: true, muted: true },
  { key: 'email', header: '이메일', muted: true },
  { key: 'teams', header: '팀', render: (r) => <Badges items={r.teams} max={3} /> },
  { key: 'actions', header: '', align: 'right', render: () => <RowActions /> },
];

export function MembersTableDemo() {
  return (
    <Table title="Team members" count="100 users" selectable pagination columns={memberColumns} data={teamMembers} />
  );
}

export function DefaultTableDemo() {
  return <Table size="md" columns={teamColumns} data={teamData} />;
}

export function SelectableTableDemo() {
  return <Table size="md" selectable columns={teamColumns} data={teamData} />;
}

export function SizesTableDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Table size="sm" columns={teamColumns} data={teamData.slice(0, 3)} />
      <Table size="md" columns={teamColumns} data={teamData.slice(0, 3)} />
      <Table size="lg" columns={teamColumns} data={teamData.slice(0, 3)} />
    </div>
  );
}

export function CustomCellTableDemo() {
  return <Table size="md" columns={fileColumns} data={fileData} />;
}

export function SortableTableDemo() {
  return (
    <Table
      size="md"
      columns={[
        { key: 'name', header: '이름', sort: 'desc', render: (r) => <UserCell src={r.avatar} name={r.name} email={r.email} /> },
        { key: 'team', header: '팀', sort: 'none' },
        { key: 'role', header: '역할' },
      ]}
      data={teamData.slice(0, 4)}
    />
  );
}

export function EmptyTableDemo() {
  return <Table size="md" columns={teamColumns} data={[]} emptyText="등록된 멤버가 없습니다." />;
}
