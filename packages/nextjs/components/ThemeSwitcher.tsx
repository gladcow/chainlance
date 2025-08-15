    // components/ThemeSwitcher.jsx
    import { useTheme } from 'next-themes';

    function ThemeSwitcher() {
      const { theme, setTheme } = useTheme();

      return (
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className="select select-bordered w-full max-w-xs">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="cupcake">Cupcake</option>
          {/* Add more options for other daisyUI themes */}
        </select>
      );
    }

    export default ThemeSwitcher;