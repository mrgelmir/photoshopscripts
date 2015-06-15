using UnityEngine;
using SimpleJSON;
using System.Collections;
using System.Collections.Generic;

[ExecuteInEditMode]
public class GuidesVisual : MonoBehaviour 
{
	public TextAsset GuidesFile;

	public float Depth = 10f;

	private List<Guide> Guides = new List<Guide>();

	protected void OnEnable()
	{
		ReadFromFile();
	}

	private void ReadFromFile()
	{
		JSONNode data = JSON.Parse(GuidesFile.text);

		float aspectRatio = data["aspectratio"].AsFloat;

		JSONArray guides = data["guides"].AsArray;

		Guides.Clear();
		Guides = new List<Guide>(guides.Count);
		for(int i=0; i<guides.Count; ++i) 
		{
			bool isHorizontal = guides [i] ["horizontal"].AsBool;
			float localPercentage = guides [i] ["percentage"].AsFloat;
			Debug.Log(isHorizontal + "|" + localPercentage);
			Guides.Add(new Guide() { horizontal = isHorizontal, percentage = localPercentage });

		}
	}

	protected void OnDrawGizmos ()
	{
		foreach (Guide guide in Guides) 
		{
			Vector3 worldStartPos = Camera.main.ViewportToWorldPoint(guide.horizontal ? new Vector3(0f, guide.percentage, Depth) : new Vector3( guide.percentage, 0f, Depth));
			Vector3 worldEndPos = Camera.main.ViewportToWorldPoint(guide.horizontal ? new Vector3(1f, guide.percentage, Depth) : new Vector3( guide.percentage, 1f, Depth));

			Gizmos.DrawLine(worldStartPos, worldEndPos);
		}
	}

	private class Guide
	{
		public bool horizontal;
		public float percentage;
	}
}
