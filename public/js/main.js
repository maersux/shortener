const copyItems = document.querySelectorAll('span[data-copy]');
for (const copyItem of copyItems) {
	copyItem.addEventListener('click', () => {
		const textToCopy = copyItem.getAttribute('data-copy');

		navigator.clipboard.writeText(textToCopy).then(() => {
			const copyIcon = copyItem.querySelector('.copy-icon');
			const successIcon = copyItem.querySelector('.success-icon');

			if (copyIcon && successIcon) {
				copyIcon.style.display = 'none';
				successIcon.style.display = 'inline';

				setTimeout(() => {
					successIcon.style.display = 'none';
					copyIcon.style.display = 'inline';
				}, 3000);
			}
		});
	});
}
