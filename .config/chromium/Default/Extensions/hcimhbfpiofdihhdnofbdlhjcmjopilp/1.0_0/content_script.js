walk(document.body);
setTimeout(function () {
	walk(document.body);
}, 1000);

function walk(node)
{
	// Source: http://is.gd/mwZp7E

	var child, next;

	switch ( node.nodeType )
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child )
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode)
{
	var v = textNode.nodeValue;

	v = v.replace(/\bTrump\b/g, "Drumpf");
	v = v.replace(/\bTRUMP\b/g, "DRUMPF");
	v = v.replace(/\bTRUMPS\b/g, "DRUMPFS");
	v = v.replace(/\bTrumps\b/g, "Drumpfs");
	v = v.replace(/\bdonaldjtrump\b/g, "donaldjdrumpf");
	v = v.replace(/\bdonaldtrump\b/g, "donalddrumpf");
	v = v.replace(/\brealdonaldtrump\b/g, "realdonalddrumpf");
	v = v.replace(/\brealDonaldTrump\b/g, "realDonaldDrumpf");
	v = v.replace(/\bMake America Great Again\b/g, "Make Donald Drumpf Again");
	v = v.replace(/\bMake America Great Again!\b/g, "Make Donald Drumpf Again!");

	textNode.nodeValue = v;
}
