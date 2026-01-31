import { useId, useState } from 'react'
import { usePreferences } from './PreferencesProvider'

export const A11yPanel = () => {
  const { a11y, updateA11y } = usePreferences()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="preferences-panel">
      <button
        type="button"
        className="btn btn-ghost"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
      >
        Accessibility
      </button>
      {open && (
        <div id={panelId} className="preferences-popover" role="dialog" aria-label="Accessibility settings">
          <div className="preference-item">
            <label className="toggle">
              <input
                type="checkbox"
                checked={a11y.textSize === 'large'}
                onChange={(event) =>
                  updateA11y({ textSize: event.target.checked ? 'large' : 'normal' })
                }
              />
              Increase text size
            </label>
          </div>
          <div className="preference-item">
            <label className="toggle">
              <input
                type="checkbox"
                checked={a11y.highContrast}
                onChange={(event) => updateA11y({ highContrast: event.target.checked })}
              />
              High contrast mode
            </label>
          </div>
          <div className="preference-item">
            <label className="toggle">
              <input
                type="checkbox"
                checked={a11y.reduceMotion}
                onChange={(event) => updateA11y({ reduceMotion: event.target.checked })}
              />
              Reduce motion override
            </label>
          </div>
          <p className="field-helper">System settings are still respected.</p>
        </div>
      )}
    </div>
  )
}
