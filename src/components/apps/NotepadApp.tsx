
import { Window } from '../Window';

interface Props {
  data: any[];
  windowProps: any;
}

export const NotepadApp: React.FC<Props> = ({ data, windowProps }) => {
  return (
    <Window {...windowProps} title="Education.txt - Notepad" style={{ width: '450px', height: '350px' }}>
      <div style={{ padding: '0', background: '#fff', height: '100%' }}>
        <div style={{ borderBottom: '1px solid #ece9d8', padding: '2px 5px', fontSize: '12px', background: '#fff', color: '#000' }}>
          File Edit Format View Help
        </div>
        <div style={{ padding: '10px', fontFamily: 'Courier New', fontSize: '13px', whiteSpace: 'pre-wrap', overflowY: 'auto', height: 'calc(100% - 25px)' }}>
          {data.map((edu: any, i: number) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              {'='.repeat(40) + '\n'}
              {edu.school + '\n'}
              {edu.date + '\n'}
              {edu.degree + '\n'}
              {edu.courses && (
                <>
                  {'\n'}
                  {'Related Courses:\n'}
                  {'-'.repeat(40) + '\n'}
                  {edu.courses + '\n'}
                </>
              )}
              {'='.repeat(40)}
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
