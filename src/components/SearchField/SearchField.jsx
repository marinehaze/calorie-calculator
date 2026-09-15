import './SearchField.css';
import { IconButton } from '../IconButton/IconButton';
import { IconSearch, IconBarcode, IconClose } from '../../lib/icons';

/**
 * SearchField — used on Food Search and Recipe Discovery.
 *
 * The barcode action is rendered inside the field, and only on Food Search
 * (`onScan`). Recipe Discovery omits it, which is the only difference between
 * the two usages.
 *
 * Clear and scan are real 44px buttons; the visible label for each is its
 * aria-label, since neither carries text.
 */
export const SearchField = ({
  value = '',
  onChange,
  onScan,
  onClear,
  placeholder = 'Search foods and products',
  label = 'Search',
  loading = false,
  disabled = false,
  id = 'ds-search',
  ...rest
}) => (
  <div className="ds-search-field">
    <span className="ds-search-field__icon"><IconSearch size={20} /></span>

    <label className="ds-sr-only" htmlFor={id}>{label}</label>
    <input
      id={id}
      type="search"
      className="ds-search-field__input"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      autoComplete="off"
      {...rest}
    />

    {loading && <span className="ds-search-field__spinner" role="status" aria-label="Searching" />}

    {!loading && value && onClear && (
      <IconButton icon={<IconClose size={20} />} label="Clear search" onClick={onClear} disabled={disabled} />
    )}

    {onScan && (
      <>
        <span className="ds-search-field__divider" aria-hidden="true" />
        <IconButton icon={<IconBarcode />} label="Scan a barcode" onClick={onScan} disabled={disabled} />
      </>
    )}
  </div>
);
