
import { Window } from '../Window';

interface Props {
  data: any[];
  windowProps: any;
}

export const InternetExplorerApp: React.FC<Props> = ({ data, windowProps }) => {
  return (
    <Window {...windowProps} title="Work Experience - Microsoft Internet Explorer" style={{ width: '600px', height: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ background: '#ece9d8', borderBottom: '1px solid #c0c0c0' }}>
          <div style={{ display: 'flex', gap: '15px', padding: '5px', borderBottom: '1px solid #fff', fontSize: '12px' }}>
            <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '5px', gap: '10px' }}>
             <span style={{ color: '#ccc', fontWeight: 'bold' }}>&#8592; Back</span>
             <span style={{ color: '#ccc', fontWeight: 'bold' }}>&#8594;</span>
             <span>Stop</span>
             <span>Refresh</span>
             <span>Home</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '5px', borderTop: '1px solid #c0c0c0' }}>
             <span style={{ color: '#666', marginRight: '10px' }}>Address</span>
             <div style={{ flex: 1, background: '#fff', border: '1px solid #7f9db9', padding: '2px 5px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#000' }}>http://www.haoyu.com/experience</span>
             </div>
             <span style={{ marginLeft: '10px' }}>Go</span>
          </div>
        </div>
        
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, background: '#fff' }}>
          <h1 style={{ color: '#003399', borderBottom: '2px solid #003399', paddingBottom: '5px' }}>Work Experience</h1>
          {data.map((work: any, index: number) => (
            <div key={index} style={{ marginBottom: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
                <h3 style={{ margin: 0, color: '#000', fontSize: '15px' }}>{work.title}</h3>
                <span style={{ fontSize: '12px', color: '#666' }}>{work.date}</span>
              </div>
              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                {work.bullets.map((bullet: string, bIndex: number) => (
                  <li key={bIndex} style={{ marginBottom: '6px', fontSize: '13px' }}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
