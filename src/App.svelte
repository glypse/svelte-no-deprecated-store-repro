<script lang="ts">
	import { legacyCount } from './stores.ts';

	// Reported: no-deprecated sees `legacyCount` itself.
	legacyCount.set(1);

	// Not reported: `$legacyCount` reads the same deprecated store.
	const doubled = $derived($legacyCount * 2);
</script>

<!-- Not reported either. -->
<p>{$legacyCount} × 2 = {doubled}</p>
