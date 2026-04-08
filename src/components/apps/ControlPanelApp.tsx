
import { Window } from '../Window';

interface Props {
  data: any[];
  windowProps: any;
}

export const ControlPanelApp: React.FC<Props> = ({ data, windowProps }) => {
  return (
    <Window {...windowProps} title="Control Panel" style={{ width: '500px', height: '350px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ background: '#ece9d8', borderBottom: '1px solid #c0c0c0', padding: '2px 5px', fontSize: '12px' }}>
          File Edit View Favorites Tools Help
        </div>
        <div style={{ flex: 1, background: '#fff', padding: '20px', overflowY: 'auto' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#003399' }}>
            <span style={{ fontSize: '24px' }}>⚙️</span> Pick a category to learn more
          </h2>
          <hr style={{ borderColor: '#ece9d8', marginBottom: '20px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {data.map((skill: any, index: number) => (
              <div key={index} style={{ display: 'flex', gap: '10px' }}>
                <div style={{ fontSize: '30px' }}>
                   {index === 0 ? '⌨️' : index === 1 ? '📚' : index === 2 ? '☁️' : '🗄️'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#003399', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>{skill.category}</div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>{skill.items}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
};
