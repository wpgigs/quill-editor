const Quill = window.Quill;

const Font = Quill.import('formats/font');
const Size = Quill.import('attributors/style/size');
const BlockEmbed = Quill.import('blots/block/embed');
const Parchment = Quill.import('parchment');

class PageBreakBlot extends BlockEmbed {
	static create() {
	  let node = super.create();
	  node.setAttribute('class', 'page-break');
	  return node;
	}
}

PageBreakBlot.blotName = 'page-break';
PageBreakBlot.tagName = 'div';
Quill.register(PageBreakBlot);

// Register custom font whitelist
Font.whitelist = ["mirza", "roboto", "arsenal", "josefin-sans", "lato", "libre-franklin", "merriweather", "playfair-display"];
Quill.register(Font, true);

// Register font size whitelist
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px'];
Quill.register(Size, true);

// Register custom HR Blot
class HrBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute('class', 'hr-line');
    return node;
  }
}
HrBlot.blotName = 'hr';
HrBlot.tagName = 'hr';
Quill.register(HrBlot);

function insertHR() {
    const range = quill.getSelection();
    if (range) {
        quill.insertEmbed(range.index + 1, "hr", true);
        quill.setSelection(range.index + 2, Quill.sources.SILENT);

		updateHistoryButtons();
    }
}

// Initialize Quill editor
const quill = new Quill("#editor", {
  modules: {
    toolbar: "#toolbar",
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true,
	  addUndo: true
    }
  },
  placeholder: "Compose an epic...",
  theme: "snow",
});


const toolbar = document.querySelector('.ql-toolbar');
const pageBreakButton = document.createElement('button');
pageBreakButton.innerHTML = '<svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20"><path d="M3.598.687h1.5v5h-1.5zm14.5 0h1.5v5h-1.5z"></path><path d="M19.598 4.187v1.5h-16v-1.5zm-16 14.569h1.5v-5h-1.5zm14.5 0h1.5v-5h-1.5z"></path><path d="M19.598 15.256v-1.5h-16v1.5zM5.081 9h6v2h-6zm8 0h6v2h-6zm-9.483 1L0 12.5v-5z"></path></svg>';
pageBreakButton.classList.add('ql-page-break');
pageBreakButton.addEventListener('click', function() {
  const range = quill.getSelection();
  if (range) {
    quill.insertEmbed(range.index, 'page-break', true);
    quill.setSelection(range.index + 1, Quill.sources.SILENT);

	updateHistoryButtons();
  }
});
toolbar.appendChild(pageBreakButton);


 // Font Size Dropdown Change Event
 document.getElementById('fontSizeSelect').addEventListener('change', function() {
	var size = this.value;
	var range = quill.getSelection();

	if (range && range.length > 0) {
		quill.formatText(range.index, range.length, 'size', size);
	}
});

// Undo/Redo Button Event
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
undoButton.disabled = true;
redoButton.disabled = true;

function updateHistoryButtons() {
    undoButton.disabled = !quill.history.stack.undo.length;
    redoButton.disabled = !quill.history.stack.redo.length;
}

undoButton.addEventListener('click', function() {
    quill.history.undo();
    updateHistoryButtons();
});

redoButton.addEventListener('click', function() {
    quill.history.redo();
    updateHistoryButtons();
});

// Track any change, including formatting and content changes
quill.on('text-change', function() {
    updateHistoryButtons();
});

updateHistoryButtons();
