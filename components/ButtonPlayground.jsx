'use client';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import { useState } from 'react'

export const ButtonPlayground = () => {
    const code = `
function Demo() {
  const [count, setCount] = useState(0)
  
  return (
    <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
      <button 
        onClick={() => setCount(c => c + 1)}
        style={{ 
          padding: '12px 24px', 
          backgroundColor: 'var(--colors-background-bgBrandPrimary, #7f56d9)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: 'var(--fontSize-textMd, 16px)',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.2s',
        }}>
        클릭해보세요! {count}번
      </button>
    </div>
  )
}
render(<Demo />)`

    return (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <LiveProvider code={code} scope={{ useState }} noInline={true}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    alignItems: 'start'
                }}>
                    {/* 에디터 영역 */}
                    <div style={{
                        backgroundColor: '#1E1E1E',
                        borderRadius: '8px',
                        overflow: 'hidden',
                    }}>
                        <div style={{ padding: '8px 16px', backgroundColor: '#2D2D2D', color: '#999', fontSize: '12px' }}>
                            Editable Code (React)
                        </div>
                        <LiveEditor style={{ fontSize: '14px', fontFamily: 'monospace' }} />
                    </div>

                    {/* 프리뷰 영역 */}
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '1px solid #eaeaea',
                        overflow: 'hidden',
                        height: '100%',
                    }}>
                        <div style={{ padding: '8px 16px', borderBottom: '1px solid #eaeaea', color: '#666', fontSize: '12px', backgroundColor: '#f9f9f9' }}>
                            Live Preview
                        </div>
                        <div style={{ padding: '20px', color: 'black' }}>
                            <LivePreview />
                        </div>
                    </div>
                </div>
                <LiveError style={{ color: 'red', marginTop: '10px', padding: '10px', backgroundColor: '#ffebe9', borderRadius: '4px' }} />
            </LiveProvider>
        </div>
    )
}
