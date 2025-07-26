document.addEventListener('DOMContentLoaded', function() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const loadingOverlay = document.getElementById('loading-overlay');
    const conversionForms = document.querySelectorAll('.conversion-form');

    // Add event listener to each file input for preview
    fileInputs.forEach(input => {
        let filePreviewsContainer = null;
        let nextSibling = input.parentElement.nextElementSibling;
        while (nextSibling) {
            if (nextSibling.classList.contains('file-previews')) {
                filePreviewsContainer = nextSibling;
                break;
            }
            nextSibling = nextSibling.nextElementSibling;
        }

        const customWrapper = input.closest('.custom-file-input-wrapper');
        const placeholderText = customWrapper ? customWrapper.querySelector('.placeholder-text') : null;

        input.addEventListener('change', function() {
            if (filePreviewsContainer) {
                filePreviewsContainer.innerHTML = '';
                
                if (this.files.length > 0) {
                    if (placeholderText) {
                        placeholderText.style.display = 'none';
                    }
                    for (let i = 0; i < this.files.length; i++) {
                        const file = this.files[i];
                        const filePreviewItem = document.createElement('div');
                        filePreviewItem.classList.add('file-preview-item');

                        const fileNameSpan = document.createElement('span');
                        const maxNameLength = 15;
                        if (file.name.length > maxNameLength) {
                            fileNameSpan.textContent = file.name.substring(0, maxNameLength) + '...';
                            fileNameSpan.title = file.name;
                        } else {
                            fileNameSpan.textContent = file.name;
                        }

                        if (file.type.startsWith('image/')) {
                            const img = document.createElement('img');
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                img.src = e.target.result;
                            };
                            reader.readAsDataURL(file);
                            filePreviewItem.appendChild(img);
                        } else if (file.type === 'application/pdf') {
                            const pdfIcon = document.createElement('img');
                            pdfIcon.src = "{{ url_for('static', filename='images/pdf-icon-placeholder.png') }}";
                            pdfIcon.alt = "PDF Icon";
                            filePreviewItem.appendChild(pdfIcon);
                        } else {
                            const genericIcon = document.createElement('img');
                            genericIcon.src = "{{ url_for('static', filename='images/file-icon-placeholder.png') }}";
                            genericIcon.alt = "File Icon";
                            filePreviewItem.appendChild(genericIcon);
                        }

                        filePreviewItem.appendChild(fileNameSpan);
                        filePreviewsContainer.appendChild(filePreviewItem);
                    }
                } else {
                    if (placeholderText) {
                        placeholderText.style.display = 'block';
                    }
                }
            }
        });

        if (input.files.length > 0) {
            input.dispatchEvent(new Event('change'));
        }
    });

    conversionForms.forEach(form => {
        form.addEventListener('submit', function() {
            if (loadingOverlay) {
                loadingOverlay.classList.remove('hidden');
            }
        });
    });

    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        }
    });

    const customPagesRadio = document.getElementById('custom_pages_radio');
    const pageRangesInput = document.getElementById('page_ranges_input');

    if (customPagesRadio && pageRangesInput) {
        const togglePageRangesInput = () => {
            pageRangesInput.style.display = customPagesRadio.checked ? 'block' : 'none';
            pageRangesInput.required = customPagesRadio.checked;
        };

        togglePageRangesInput();

        document.querySelectorAll('input[name="split_option"]').forEach(radio => {
            radio.addEventListener('change', togglePageRangesInput);
        });
    }
});