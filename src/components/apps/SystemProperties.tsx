
import { Window } from '../Window';

interface Props {
  data: any;
  windowProps: any;
}

export const SystemProperties: React.FC<Props> = ({ data, windowProps }) => {
  return (
    <Window {...windowProps} title="System Properties" style={{ width: '400px', height: 'auto' }}>
      <div style={{ display: 'flex', gap: '20px', padding: '10px' }}>
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '40px' }}>💻</div>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', margin: '0 0 10px 0' }}>{data.name}</h2>
          <hr style={{ margin: '10px 0' }}/>
          <p style={{ margin: '5px 0', fontSize: '13px' }}><strong>Contact:</strong></p>
          <p style={{ margin: '5px 0', fontSize: '13px' }}>{data.contact}</p>
          <div style={{ marginTop: '15px' }}>
            {data.links && data.links.map((link: any, idx: number) => (
              <div key={idx} style={{ marginBottom: '5px' }}>
                <a href={link.url} target="_blank" rel="noreferrer" style={{ color: '#0000ee' }}>
                  {link.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: '#ece9d8', padding: '10px', textAlign: 'right', borderTop: '1px solid #c0c0c0', margin: '10px -10px -10px -10px' }}>
         <button style={{ padding: '2px 15px', fontFamily: 'Tahoma' }}>OK</button>
         <button style={{ padding: '2px 15px', fontFamily: 'Tahoma', marginLeft: '10px' }}>Cancel</button>
      </div>
    </Window>
  );
};
