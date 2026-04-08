import { useState } from 'react';
import { Window } from '../Window';

interface Props {
  data: any[];
  windowProps: any;
}

export const ExplorerApp: React.FC<Props> = ({ data, windowProps }) => {
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);

  return (
    <Window {...windowProps} title="My Projects" style={{ width: '550px', height: '350px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ background: '#ece9d8', borderBottom: '1px solid #c0c0c0', padding: '2px 5px', fontSize: '12px', display: 'flex', gap: '15px' }}>
          <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ width: '150px', background: 'linear-gradient(180deg, #748de5 0%, #b0c4de 100%)', padding: '10px', overflowY: 'auto' }}>
            <div style={{ background: '#fff', borderRadius: '3px', padding: '5px', marginBottom: '10px', boxShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#003399', fontSize: '11px' }}>System Tasks</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11px', color: '#0000ee' }}>
                <li style={{ marginBottom: '3px', cursor: 'pointer' }} onClick={() => setSelectedFolder(null)}>🔄 View all projects</li>
              </ul>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div style={{ flex: 1, background: '#fff', padding: '10px', overflowY: 'auto' }}>
             {selectedFolder === null ? (
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                 {data.map((proj: any, index: number) => (
                   <div 
                     key={index} 
                     style={{ width: '100px', cursor: 'pointer', textAlign: 'center' }}
                     onClick={() => setSelectedFolder(index)}
                   >
                     <div style={{ fontSize: '40px', marginBottom: '5px' }}>📁</div>
                     <div style={{ fontSize: '11px', wordWrap: 'break-word' }}>{proj.name}</div>
                   </div>
                 ))}
               </div>
             ) : (
               <div>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    {data[selectedFolder].url ? (
                      <a href={data[selectedFolder].url} target="_blank" rel="noreferrer" style={{ color: '#003399', textDecoration: 'underline' }}>
                        {data[selectedFolder].name}
                      </a>
                    ) : (
                      data[selectedFolder].name
                    )}
                  </h3>
                  {data[selectedFolder].url && (
                    <div style={{ fontSize: '11px', marginBottom: '10px' }}>
                      <a href={data[selectedFolder].url} target="_blank" rel="noreferrer" style={{ color: '#0000ee' }}>
                        🔗 {data[selectedFolder].url}
                      </a>
                    </div>
                  )}
                  <ul style={{ paddingLeft: '20px' }}>
                    {data[selectedFolder].bullets.map((bullet: string, bIndex: number) => (
                      <li key={bIndex} style={{ marginBottom: '6px', fontSize: '13px' }}>{bullet}</li>
                    ))}
                  </ul>
               </div>
             )}
          </div>
        </div>
      </div>
    </Window>
  );
};
